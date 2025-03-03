import React from 'react'
import Navbar from '../components/Navbar'
import './landing.css'

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className="landing-container">
        <div className="landing-content">
          <h1>Welcome to TicStack</h1>
          <p>Level up your gaming experience—Login, Compete, Conquer! 🎮🔥</p>
        </div>
      </div>
    </>
  )
}

export default LandingPage