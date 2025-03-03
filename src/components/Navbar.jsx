import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="gaming-nav">
      <div className="nav-brand">
        <h1>TicStack</h1>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to="/login" className={({isActive}) => 
            isActive ? "nav-link active" : "nav-link"}>
            <span className="link-text">LOGIN</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/register" className={({isActive}) => 
            isActive ? "nav-link active" : "nav-link"}>
            <span className="link-text">REGISTER</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar