import axios from "axios"; 
import User from "./user";
import "./SignUp.css";
import { useEffect, useState, ReactNode } from "react";





const SignUp = (props: { children?: ReactNode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [register, setRegister] = useState(false);
  
  const clientUser:User = 
  {
    userName: userName,
    email: email,
    passwordHash: password
  }

  function handleSubmit (e:React.FormEvent)
  {
    e.preventDefault();
    axios("http://localhost:9000/api/createUser", 
    {
      method: "POST",
      data: clientUser
    })
    .then((result) => {console.log(result);})
    .catch ((error) => {console.log(error);})  
  }

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>User Registration</title>
      <div className="container">
        <h2 className="title">Sign Up</h2>
        <form action="#" method="post" onSubmit={(e)=> handleSubmit(e)}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={userName} onChange={(e)=> setUserName(e.target.value)} /> 
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="form-group">
            <input type="submit" defaultValue="Sign Up" />
          </div>
          <div className="form-group"> 
            <span className="switch-text">
              {/*TODO sign in needs to be changed to LINK react component rather than a html element */}
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
