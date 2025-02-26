import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import UserModel from './models/UserModel';
import bcrypt from 'bcrypt';

const app = express();

mongoose.connect('mongodb://localhost:27017/Ticstack')
 .then(() => console.log('Connected to MongoDB'))
 .catch(error => console.error('Error connecting to MongoDB:', error));

app.use(cors());
app.use(express.json());

app.post('/register', (req, res) => {
    const {name,email,passwod}=req.body
    UserModel.findOne({ email }).then((user) => {
        if (user) return res.status(400).json({ message: 'Email already exists' });
        bcrypt.hash(passwod, 10).then((hashedPassword) => {
            const newUser = new UserModel({ name, email, password: hashedPassword });
            newUser.save().then(() => res.json({ message: 'User registered successfully' }));
        });
    }).catch((error) => res.status(500).json({ error }));

});


app.listen(5000, () => console.log('Server running on port 5000'));