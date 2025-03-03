import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import UserModel from './models/UserModel.js';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import http from 'http'
import {Server} from 'socket.io'
import MessageModel from './models/MessageModel.js';

const app = express();
const PORT = 5000;
const client = new OAuth2Client("531410137605-phcrcg17b16bp5rlqid92b89a416i44t.apps.googleusercontent.com");

const server = http.createServer(app);

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["my-custom-header"],
    },
    transports: ['websocket'],
    pingTimeout: 60000,
    pingInterval: 25000
});

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://127.0.0.1:27017/applogin", {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Routes
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Enhanced validation
        if (!name?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Email format validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if user exists
        const existingUser = await UserModel.findOne({ email }).maxTimeMS(20000);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new UserModel({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await UserModel.findOne({ email: email.toLowerCase() }).maxTimeMS(20000);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ 
            message: 'Login successful',
            user: { 
                id: user._id,
                name: user.name,
                email: user.email 
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


app.post('/auth/google/callback', async (req, res) => {
    try {
        const { token } = req.body;      
        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }
        const ticket = await client.verifyIdToken({             // Verify Google Token
            idToken: token,
            audience: "531410137605-phcrcg17b16bp5rlqid92b89a416i44t.apps.googleusercontent.com"
        });
        const payload = ticket.getPayload();           //Get the image, name,email as info
        const { name, email, picture } = payload;

        let user = await UserModel.findOne({ email }); // Check if user exists

        if (!user) {
            // Register new user if not found
            user = new UserModel({name, email, googleId: payload.sub, picture: picture, password: ""});
            await user.save();
        }

        const authToken = jwt.sign(          // Generate JWT Token
            { id: user._id }, 
            "Never Mind", // Note: In production, use an environment variable for the secret
            { expiresIn: '1h' }
        );
        res.json({
            success: true,
            token: authToken,
            user: {id: user._id, name: user.name, email: user.email, picture: user.picture }});
            
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(400).json({ 
            success: false, 
            message: "Google login failed",
            error: error.message 
        });
    }
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.log("Connection error:", err);
    });
    // Send existing messages when a user connects
    socket.on("getMessages", async () => {
        try {
            const messages = await MessageModel.find()
                .sort({ timestamp: -1 })
                .limit(50);
            socket.emit("previousMessages", messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    });

    // Listen for chat messages
    socket.on("message", async (data) => {
        try {
            const { userId, username, content } = data;
            
            // Create and save new message
            const newMessage = new MessageModel({
                userId,
                username,
                content,
            });
            await newMessage.save();

            // Broadcast message to all connected clients
            io.emit("message", {
                _id: newMessage._id,
                userId,
                username,
                content,
                timestamp: newMessage.timestamp
            });
        } catch (error) {
            console.error("Error broadcasting message:", error);
            socket.emit("error", "Failed to send message");
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});
// Start server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port :${PORT}`);
    });
});

