import { SessionManager, Session } from "./Session";

class Bracket
{
    isRunning: boolean;

    //each bracket should have a list (array) of users (sessions) 
    protected Sessions: Array<Session>

    constructor()
    {
        this.isRunning = true;
        this.Sessions = [];
    }

}

export default class BracketManager extends Bracket
{

    sessionManager: SessionManager;

    static #instance: BracketManager;
    private constructor()
    {
        super();
        this.sessionManager = SessionManager.instance;
    }
    public static getInstance(): BracketManager
    {
        if (!BracketManager.#instance)
        {
            BracketManager.#instance = new BracketManager();
        }

        return BracketManager.#instance;
    }

    private initBracket()
    {
        //load in progress games from database async
    }

    public createBracket()
    {
        //create new Bracket(); 
        //call initBracket(); 
    }

    public deleteBracket()
    {
        //remove bracket from bracketManager
    }

    public joinBracket()
    {
        //get bracket from bracketManager by id
        // add user (sessionID) to bracket
    }

    public leaveBracket()
    {
        //get bracket from bracketManager by id
        // remove user (sessionID) from bracket
    }



}