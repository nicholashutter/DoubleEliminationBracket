import axios from axios; 
import User from "./user";
import {User} from "../../expressServer/src/user";
import { useRouteError, Link, Outlet } from "react-router-dom";
import "./HomePage.css";
import { useEffect, useState, ReactNode } from "react";

export const HomePage = (props: {
  children?: ReactNode;
}): React.JSX.Element => {
  const [serverUrl, setServerUrl] = useState("");
  const [serverResponse, setServerResponse] = useState("");

  useEffect(() => {
  
  }, [serverUrl]);

  // TODO find out if we can just send the entire user object or we need to do some sort of casting 
  const credentials = {username: "nicholas",
    password: "nicholas"
  }
  
  function handleSignInForm(): void {
    fetch("http://localhost:9000/",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

  }

  return (
    <>
      <div className="container">
        <h2 className="title">Welcome!</h2>

        <div className="form-group">
          <label htmlFor="username">Username:</label>

          <input type="text" id="username" name="username" />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>

          <input type="password" id="password" name="password" />

          <span className="switch-text">
            <Link style={{ color: "white" }}  to={"/menu"}>
              <button onClick={handleSignInForm}>
                Sign In
              </button>
            </Link>

            <label className="form-group">Or</label>

            <Link style={{ color: "white" }} to={"/createguest"}>
              <button>
                Continue As Guest
              </button>
            </Link>

            <Link style={{ color: "white" }} to={`/signup`}>
              <button>
                Sign Up Here
              </button>
            </Link>
          </span>
        </div>
      </div>
    </>
  );
};

export const ErrorPage = (props: {
  children?: ReactNode;
}): React.JSX.Element => {
  const error = useRouteError();
  console.error(error);
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Page Not Found</title>
      <div className="container">
        <h2 className="title">Oh Snap!</h2>
        <div className="form-group">
          <label>
            There's been an error! We can't get you where you were trying to go.
          </label>
        </div>
      </div>
    </>
  );
};
