import axios from "axios"; 
import User from "./user";

import "./JoinTourney.css";

import { useState, useEffect, ReactNode } from "react";

const JoinTourney = (props: { children?: ReactNode }): React.JSX.Element => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Join Room</title>
      <div className="container">
        <h2 className="title">Join Room</h2>
        <form>
          <div className="form-group">
            <label htmlFor="session-code">Session Code:</label>
            <input
              type="text"
              id="session-code"
              name="session-code"
              maxLength={4}
            />
          </div>
          <div className="form-group">
            <input type="submit" defaultValue="Join Room" />
            <a href="TourneyMenu.html" className="cancel-link">
              Cancel and Return to Main Menu
            </a>
          </div>
        </form>
        <div id="waiting-message" className="waiting-message">
          Waiting for other players...
        </div>
      </div>
    </>
  );
};

export default JoinTourney;
