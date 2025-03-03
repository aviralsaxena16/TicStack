import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaUser } from 'react-icons/fa';
import './Navbar2.css'


const Navbar2 = () => {
  return (

    <nav>
        <ul>
            <li>
                <NavLink exact to="/profile" activeClassName="active">
                    <FaUser /> Home
                </NavLink>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar2