
import {v4 as uuidv4} from "uuid";
import DbHandler from './DbHandler';
import {User} from "./user"; 
/* Wrapper class that encapsules Session class */ 
export class SessionManager{

    protected sessArr:Array<Session>;
    static #instance: SessionManager;

    //Create an empty array of sessions
    private constructor (){
        this.sessArr = [];

    }
    //establish singleton pattern 
    public static get instance(): SessionManager{
        if (!SessionManager.#instance){
            SessionManager.#instance = new SessionManager();
        }

        return SessionManager.#instance; 
    }
    //create session object add to session array for tracking
    async createSession (user:User):  Promise<string> {
        const currentSession:Session = await Session.init(user); 

        this.sessArr.push(currentSession);
        
        return currentSession.SessionID; 
    }

    //user join sessoin 
    async joinSession(searchForID: string, user:User):Promise<void>{


        const currentSession = this.sessArr.find(Session => Session.SessionID === searchForID);
        
        if (currentSession){
            await currentSession.addUser(searchForID, user);
        }
        else {console.log("No session found")}; 

    }
}

//Session class manages code representation of session
export class Session 
{
    protected db: DbHandler;
    protected sessionID: string;
    protected userArr: Array<User>;

    //init database handler and unique sessionID and empty user array 
    private constructor(){
        this.db = new DbHandler();
        this.sessionID = uuidv4();
        this.userArr = [];
    }

    //async static function calls private constructor and creates session in database
    public static async init(user:User):Promise<Session>{
        const currentSession:Session = new Session();
        const db = new DbHandler();
        await db.joinSession(currentSession.SessionID, user);
        return currentSession; 
    }

    //getter for sessionID property
    public get SessionID(): string {
        return this.sessionID;
    }

    //add user to user array and session in database
    public async addUser (sessionID:string ,user: User): Promise<void> {

        this.userArr.push(user); 

       await this.db.joinSession(sessionID,user);
    }

    //remove user from database and user array 
    public async removeUser (user: User, searchForID:number): Promise<boolean> {
        
        try {
            await this.db.leaveSession(user);

            this.userArr = this.userArr.filter((user) => user.getUserID() === searchForID); 
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

}