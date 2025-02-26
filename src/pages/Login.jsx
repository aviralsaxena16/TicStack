import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = (await axios.post('http://localhost:5000/login', { email, password }))
            if (response=='User not found'){
                alert('User not found')
                navigate('/register')
            }
            else if (response==='Invalid password'){
                alert('Invalid password')
            }
            else{
                alert('Registeration Successful')
                navigate('/')
            }
            
        } catch (error) {
            console.error(error)
        }
    }
  return (
    <div>
        <h1>Login</h1>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login