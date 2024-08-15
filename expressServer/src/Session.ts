import { v4 as uuidv4 } from "uuid";

/* 
Session class associates sessions with userIDs for authentication
*/ 
class Session
{
  sessionID: string;
  userID: string;

  protected constructor(sessionID?: string, userID?: string)
  {

    this.sessionID = sessionID!;
    this.userID = userID!;
  }

  get getSessionID(): string
  {
    return this.sessionID;
  }

  get getUserID(): string
  {
    return this.userID;
  }
}

//SessionManager class wraps sessions and provides a global entry point for all sessions plus encapsulation
export default class SessionManager extends Session
{
  Sessions: Array<Session>;
  static #instance: SessionManager;
  numOfSessions: number;


  constructor()
  {
    super(); //empty parent object garbage collector should delete
    this.Sessions = [];
    this.numOfSessions = 0;
  }

  //establish singleton pattern
  public static get getInstance(): SessionManager
  {
    if (!SessionManager.#instance)
    {
      SessionManager.#instance = new SessionManager();
    }

    return SessionManager.#instance;
  }
  //create session object add to session array for tracking
  public createSession(sessionID: string, userID: string): string
  {

    const session = new Session(uuidv4(), userID);
    this.Sessions.push(session);
    return session.getSessionID;
  }

  public deleteSession(sessionID: string)
  {
    this.Sessions.splice(
      this.Sessions.findIndex((Session) => Session.getSessionID === sessionID),
      1
    );
  }

  //don't know if this will have a use or not yet
  public getUser(sessionID: string): string
  {
    let foundUserID = "";
    this.Sessions.forEach((Session: Session) =>
    {
      if (Session.getSessionID === sessionID)
      {
        foundUserID = Session.getUserID;
        return foundUserID;
      }
    });
    return foundUserID;
  }
}
