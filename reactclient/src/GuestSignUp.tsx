import axios from "axios"; 
import User from "./user";
import "./GuestSignUp.css";
import { useEffect, useState, ReactNode } from "react";
import {Link} from 'react-router-dom';

const GuestSignUp = (props: { children?: ReactNode }) => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>User Registration</title>
      <div className="container">
        <h2 className="title">Guest Sign Up</h2>
        <form >
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" />
            <br/>
            <label>Guest Stats Do Not Get Tracked</label>
          </div>
          <div className="form-group">
            <input type="submit" defaultValue="Sign Up" />
          </div>
          <div className="form-group">
            <span className="switch-text">
              Already have an account? <Link to="/">Sign In Here</Link>{" "}
              {/* Sign in option */}
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default GuestSignUp;
