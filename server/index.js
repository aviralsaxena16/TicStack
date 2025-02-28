import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import UserModel from './models/UserModel.js';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 5000;
const client = new OAuth2Client("531410137605-phcrcg17b16bp5rlqid92b89a416i44t.apps.googleusercontent.com");

// Middleware
app.use(cors());
app.use(express.json());

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

        // Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: "531410137605-phcrcg17b16bp5rlqid92b89a416i44t.apps.googleusercontent.com"
        });

        const payload = ticket.getPayload();
        const { name, email, picture } = payload;

        // Check if user exists
        let user = await UserModel.findOne({ email });

        if (!user) {
            // Register new user if not found
            user = new UserModel({
                name,
                email,
                googleId: payload.sub, // Add Google ID
                picture: picture,
                password: "" // No password for Google users
            });
            await user.save();
        }

        // Generate JWT Token
        const authToken = jwt.sign(
            { id: user._id }, 
            "Never Mind", // Note: In production, use an environment variable for the secret
            { expiresIn: '1h' }
        );

        res.json({
            success: true,
            token: authToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            }
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(400).json({ 
            success: false, 
            message: "Google login failed",
            error: error.message 
        });
    }
});

// Start server
connectDB().then(() => {
    app.listen(5000, () => {
        console.log(`Server running on port :5000`);
    });
});

