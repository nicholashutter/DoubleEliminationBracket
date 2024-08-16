import UserManager from "./user";
import { User } from "./user";

type Seed = number; 

export interface playerContainer {
       Player1:string|boolean,
       Player2:string|boolean,
     
} 
/*
Run the bracket and update users
*/
class Bracket
{
    userManager:UserManager;
    isRunning: boolean;
    //each bracket should have bracketData holding users and their seed values
    protected bracketData: Map<User, Seed>; 

    //flags to break from listener loop
    protected player1: boolean; 
    protected player2: boolean; 

    protected constructor()
    {
        this.isRunning = true;
        this.bracketData = new Map();
        this.player1 = true;
        this.player2 = false; 
        this.userManager = UserManager.getInstance;
    }

    joinBracket(userID:string)
    {
        //TODO server should call SessionManager.getUser then call this with that ID if exists
        //get user from UserManager and add to bracketData
    }

    createBracket()
    {
        //TODO
        //look at Sessions.length to determine how bracket should be seeded 
        //assign seed value to each user based on total length of bracket
        //call startMatch
    }

    startMatch()
    {
        //TODO
        //isRunning = true
        //load 2 users based on their respective seed from bracketData
        //player 1 and player 2 both have flags

        //returnUserData
    }


    returnUserData(Player1:string, Player2:string): playerContainer
    {
        const playerContainer:playerContainer = {Player1, Player2}
        //return to server then res.send this object to client in response 
        return playerContainer; 
    }

    selectWinner(playerContainer:playerContainer)
    {
        
        const Player1 = playerContainer.Player1;
        const Player2 = playerContainer.Player2;

        //true from client indicates winner 
        if (Player1 === Player2)
        {
            this.player1 = true; 
            this.player2 = true;
            console.log("invalid response from client game crashed"); 
            this.isRunning = false
        }
        if (Player1 === true)
        {
            this.player1 = true;
            this.isRunning = false 
        }
        if (Player2 === true)
        {
            this.player2 = true; 
            this.isRunning = false
        }
        this.player1 = this.player1 ? true : false;
        this.player2 = !this.player1; 
    }




}

export default class BracketManager extends Bracket
{
    
    static #instance: BracketManager;
    private constructor()
    {
        super();
         
    }
    public static get getInstance(): BracketManager
    {
        if (!BracketManager.#instance)
        {
            BracketManager.#instance = new BracketManager();
        }

        return BracketManager.#instance;
    }

    public createBracket()
    {
        //TODO
        //create new Bracket(); 
        //call initBracket(); 
    }

    public deleteBracket()
    {
        //TODO
        //remove bracket from bracketManager
    }

    public joinBracket()
    {
        //TODO
        //get bracket from bracketManager by id
        // add user (sessionID) to bracket
    }

    public leaveBracket()
    {
        //TODO
        //get bracket from bracketManager by id
        // remove user (sessionID) from bracket
    }



}