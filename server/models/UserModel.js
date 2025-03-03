import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    picture: { type: String ,default: 'https://img.freepik.com/premium-vector/gamer-youtuber-gaming-avatar-with-headphones-esport-logo_8169-260.jpg?w=2000'},
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);