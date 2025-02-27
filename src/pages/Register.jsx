import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/Auth'
import './Register.css'

const Register = () => {
    const [name,setName]=useState()
    const [email, setEmail]=useState()
    const [password, setPassword]=useState()
    const navigate = useNavigate()
    const {login} = useAuth()

    const handleSubmit=(e)=>{
        e.preventDefault()
        axios.post('http://localhost:5000/register',{name,email,password}).then((response)=>{
        if (response=='Email already exists'){
            alert('Email already exists')
            navigate('/login')
        }
        else{
            alert('Registered Successfully')
            login()
            navigate('/login')
        }
    })}
    
  return (
  <div className="register-container">
    <div className="register-box">
      <h1>Register</h1>
      <form>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button type="submit" className="submit-btn" onClick={handleSubmit}>Register</button>
      </form>
    </div>
  </div>
)
}

export default Register;