import axios from axios; 
import User from "./user";
import { useState, useEffect, ReactNode } from "react";

import "./TourneyMenu.css";
import { Link } from "react-router-dom";

const TourneyMenu = (props: { children?: ReactNode }) => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Super Smash Bros Inspired Main Menu</title>
      <audio id="background-music">
        <source src="smash.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="container">
        <button className="play-button">Play Music</button>
        <div className="title">Where Do We Start?</div>
        <div className="menu">
          <Link to="/create" >
            <button className="menu-button">Host Tourney!</button>
          </Link>
          <Link to="/join" >
            <button className="menu-button">Join Tourney!</button>
          </Link>
          <Link to="/aboutme" >
            <button className="menu-button">User Profile</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default TourneyMenu;
