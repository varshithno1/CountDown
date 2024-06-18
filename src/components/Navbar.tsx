import React from 'react'
import "./navbar.css"

type propsSchema = {
    name : string,
    logOut : () => Promise<void>
}

const Navbar = (props : propsSchema) => {
  return (
    <div className='navBar'>
        <div className="username">
            {props.name || "username"}'s space
        </div>
        <div className="logo">
            <img className='logoImg' src="./Logo(no bg).png" alt="" />
        </div>
        <div className="logout">
            <button onClick={props.logOut}>LogOut</button>
        </div>
    </div>
  )
}

export default Navbar