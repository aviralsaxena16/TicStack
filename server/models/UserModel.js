import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    picture: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);