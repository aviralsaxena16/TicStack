import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/Auth';
import './Login.css'; // Import the CSS file
import chess from '../../src/assets/chess.jpg'
import logo from '../../src/assets/logo.png'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            if (response === 'User not found') {
                alert('User not found');
                navigate('/register');
            } else if (response === 'Invalid password') {
                alert('Invalid password');
            } else {
                alert('Login Successful');
                login();
                navigate('/');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-form-container">
                    <div className="logo-container">
                        <img src={logo} alt="Logo" />
                        <h2>Ticstack</h2>
                    </div>

                    <div className="login-form">
                        <h1>Log in</h1>

                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            <button type="submit" className="login-button">LOGIN</button>
                        </form>

                        <a href="#" className="forgot-password">Forgot password?</a>

                        <div className="register-prompt">
                            Don't have an account? <a href="/register" className="register-link">Register here</a>
                        </div>
                    </div>
                </div>

                {/* Side Image */}
                <div className="image-container">
                    <img src={chess} alt="Side Visual" />
                </div>
            </div>
        </div>
    );
};

export default Login;
