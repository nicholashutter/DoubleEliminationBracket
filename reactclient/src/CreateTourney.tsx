import axios from axios; 
import User from "./user";
import './CreateTourney.css';
import {useEffect, useState, ReactNode} from 'react';



const CreateTourney = (props: {children?: ReactNode;}) => {
  return (
    <>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Create Tourney</title>
    <div className="container">
      <h2 className="title">Create Tourney</h2>
      <form id="createTourneyForm" >
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
          <label htmlFor="ruleset">Ruleset:</label>
          <select id="ruleset" name="ruleset" >
            <option value="single">Single Elimination</option>
            <option value="double">Double Elimination</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="max-players">Max Players:</label>
          <input
            type="number"
            id="max-players"
            name="max-players"
            min={2}
            
          />
        </div>
        <div className="form-group">
          <input type="submit" defaultValue="Host Tourney" />
          <a href="TourneyMenu.html" className="cancel-link">
            Cancel and Return to Main Menu
          </a>
        </div>
      </form>
    </div>
  </>
  );
}

export default CreateTourney;
