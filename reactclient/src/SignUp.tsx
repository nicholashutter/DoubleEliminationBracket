import axios from axios; 
import User from "./user";
import "./SignUp.css";
import { useEffect, useState, ReactNode } from "react";

const SignUp = (props: { children?: ReactNode }) => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>User Registration</title>
      <div className="container">
        <h2 className="title">Sign Up</h2>
        <form action="#" method="post">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" />
          </div>
          <div className="form-group">
            <input type="submit" defaultValue="Sign Up" />
          </div>
          <div className="form-group">
            <span className="switch-text">
              Already have an account? <a href="HomePage.html">Sign In Here</a>{" "}
              {/* Sign in option */}
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
