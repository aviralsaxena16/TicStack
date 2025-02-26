import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [name,setName]=useState()
    const [email, setEmail]=useState()
    const [password, setPassword]=useState()
    const navigate = useNavigate()

    const handleSubmit=(e)=>{
        e.preventDefault()
        axios.post('http://localhost:5000/register',{name,email,password}).then((response)=>{
        if (response=='Email already exists'){
            alert('Email already exists')
            navigate('/login')
        }
        else{
            alert('Registered Successfully')
        }
    })}
    
  return (
    <div>
        <h1>Register</h1>
        <form>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
            <label>Email:</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input type="submit" onClick={handleSubmit} value="Submit"/>
        </form>

    </div>
  )
}

export default Register;