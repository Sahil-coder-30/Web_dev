import React from 'react'
import "./nav.scss"
const Nav = () => {
  return (
    <nav>
        <div class="left">
            <div class="apple-icon">
                <img src="public/navbaricons/apple.svg" alt=""/>
            </div>
            <div class="nav-items">
                <p>Sahil Sharma</p>
            </div>
            <div class="nav-items">
                <p>File</p>
            </div>
            <div class="nav-items">
                <p>Terminal</p>
            </div>
            <div class="nav-items">
                <p>Window</p>
            </div>
        </div>
        <div class="right">
            <div class="wifi-icon">
                <img src="public/navbaricons/wifi.svg" alt=""/>
            </div>
        </div>
    </nav>
  )
}

export default Nav
