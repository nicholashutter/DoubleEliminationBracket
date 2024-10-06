import "./pre-start"; // Must be the first import


import EnvVars from "./common/EnvVars";
import server from "./server";

// **** Run **** //

const SERVER_START_MSG =
  "Express server started on port: " + EnvVars.Port.toString();

server.listen(SERVER_START_MSG, () => {})