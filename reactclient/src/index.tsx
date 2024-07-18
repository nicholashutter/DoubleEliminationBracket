import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import CreateTourney from "./CreateTourney";
import { HomePage, ErrorPage } from "./HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import JoinTourney from "./JoinTourney";
import SignUp from "./SignUp";
import TourneyMenu from "./TourneyMenu";
import AboutMe from "./AboutMe";
import GuestSignUp from "./GuestSignUp";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/menu",
    element: <TourneyMenu />,
  },
  {
    path: "/join",
    element: <JoinTourney />,
  },
  {
    path: "/create",
    element: <CreateTourney />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/aboutme",
    element:<AboutMe/>,
  },
  {
    path: "/createguest",
    element:<GuestSignUp/>,
  },
]);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={AppRouter} />
  </React.StrictMode>
);


reportWebVitals();
