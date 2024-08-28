import UserManager from "./user";
import { User } from "./user";
import crypto from "crypto"; 
type Seed = number; 


/*
Run the bracket and update users
*/
class Bracket
{
    userManager:UserManager;
    isRunning: boolean;
    //each bracket should have bracketData holding users and their seed values
    protected users: Map<User, Seed>; 
    protected alreadyPlayed: Map<User, Seed>;
    protected winner; 
    protected roomCode; 
    protected totalByes; 
    protected numOfPlayers; 
    

    protected constructor()
    {
        this.isRunning = true;
        this.users = new Map();
        this.alreadyPlayed = new Map();
        this.winner = {
            player1: 0,
            player2: 0,
            currentVotes: 0,
        }
        this.roomCode = () =>
        {
            const salt = ["w", "x", "y", "z"];
            let returnValue = salt[crypto.randomInt(3)]
            returnValue += crypto.randomInt(99000);
            return returnValue;
        } 
        this.userManager = UserManager.getInstance;
        this.totalByes = 0; 
        this.numOfPlayers = 0;
    }

    joinBracket(userID:number)
    {
       const currentUser =  this.userManager.getUser(userID); 

       try
       {
        if (currentUser.getUserName == "-1")
            {
             throw new Error ("Unable to join specified bracket. No matching user found. Err 007");
            }
        else 
            {
                currentUser.setInGame = true;
                this.userManager.updateUser(currentUser);  
                /* DOCUMENT */
                this.users.set(currentUser, this.generateSeed(this.users.size));
            }
       }
       catch (e)
       {
         console.log(e); 
       }
       
    }

    leaveBracket(userID:number)
    {
        const currentUser =  this.userManager.getUser(userID); 

       try
       {
        if (currentUser.getUserName == "-1")
            {
             throw new Error ("Unable to join specified bracket. No matching user found. Err 008");
            }
        else 
            {
                currentUser.setInGame = false;
                this.userManager.updateUser(currentUser);  
                /* DOCUMENT */
                this.users.delete(currentUser);
            }
       }
       catch (e)
       {
         console.log(e); 
       }
    }

    generateSeed(value:number)
    {
        return Math.floor(Math.random() * value);
    }

    startMatch(singleOrDouble:string)
    {
        this.isRunning = true
        this.numOfPlayers = this.users.size

        if (this.numOfPlayers < 2)
            {
                console.log("Failed to start match. Err 003"); 
            }
            else if (this.numOfPlayers < 5)
            {
                this.totalByes = 4 - this.numOfPlayers;
                this.numOfPlayers = 4; 
            }
            else if (this.numOfPlayers < 9)
            {
                this.totalByes = 8 - this.numOfPlayers;
                this.numOfPlayers = 9;
            }
            else if (this.numOfPlayers < 17)
            {
                this.totalByes = 16 - this.numOfPlayers;
                this.numOfPlayers = 16;
            }
            else if (this.numOfPlayers < 33)
            {
                this.totalByes = 32 - this.numOfPlayers;
                this.numOfPlayers = 32; 
            }
        
            this.users.forEach((value, key) =>
                {
                    key.setInGame = true; 
                })

            /* based on number of byes randomly select number of byes users to send to alreadyplayed */ 
    }

    loadPlayers()
    {
        let low = 0;
        let lower = 0; 
        let player1:any; 
        let player2:any;

       const pickPlayer1 = () =>
       {
        this.users.forEach((value, key) =>
        {
            if (low < value)
            {
                low = value;
            }
            else if (low == value)
            {
                player1 = key; 
            }
        })
        }
        

        const pickPlayer2 = () =>
        {
            this.users.forEach((value, key) =>
            {
                if (lower < value)
                {
                    low = value;
                }
                else if (lower == value)
                {
                    player2 = key; 
                }
            })
        }    
            
        pickPlayer1(); 
        pickPlayer2();

        while (this.alreadyPlayed.has (player1))
        {
            pickPlayer1 ();
            pickPlayer2 ();
        }
        try 
        {
            if (player1 && player2)
                {
                    return {player1, player2}
                }
            else 
            {
                throw new Error("Unable to find players. Err 010");  
            }
        }
        catch (e)
        {
            console.log(e); 
        }
        
        
    }

    endMatch(winner: string)
    {
        const winningUser = this.userManager.getUser(winner); 
        try 
        {
            if (winningUser.getUserName == "-1")
            {
                throw new Error("User not found. Err 001");
            }
        }
        catch (e)
        {
            console.log (e);
        }

        this.users.forEach((value, key) =>
        {
            key.setInGame = false; 
        })
        this.isRunning = false;
    }

    selectWinner(winner:string)
    {
        switch (winner)
        {
            case "player1":
                this.winner.player1++;
                this.winner.currentVotes++;
                break;

            case "player2":
                this.winner.player2++;
                this.winner.currentVotes++;
                break;

            default:
                console.log("Invalid argument");
                break; 
        }

        if (this.winner.currentVotes == 2)
        {
            if (this.winner.player1 == 2)
            {
                this.endMatch("player1");
                this.winner.currentVotes = 0; 
            }
            else if (this.winner.player2 == 2)
            {
                this.endMatch("player2");
                this.winner.currentVotes = 0; 
            }
            else if (this.winner.player1 < 2 && this.winner.player2 < 2)
            {
                return -1; 
            }
            else 
            {
                console.log("Unknown error. Err 002"); 
            }
        }
        //TODO updateUsers and load new users if ISrunning == true
    }

    get getRoomCode ()
    {
        return this.roomCode;
    }

}

export default class BracketManager extends Bracket
{
    
    static #instance: BracketManager;

    private brackets: Array <Bracket>;  

    private constructor()
    {
        super();
        this.brackets = new Array <Bracket>();
         
    }
    public static get getInstance(): BracketManager
    {
        if (!BracketManager.#instance)
        {
            BracketManager.#instance = new BracketManager();
        }

        return BracketManager.#instance;
    }

    public createRoom(userID:number)
    {
        const foundUser = this.userManager.getUser(userID); 

        try 
        {
            if (foundUser.getUserName == "-1")
                {
                    throw new Error("Unable to create room. Err 004");
                }
        }
        catch (e) 
        {
            console.log(e);
        }
        
       const currentBracket = new Bracket();
       this.brackets.push(currentBracket);
       const roomCode = currentBracket.getRoomCode; 
       currentBracket.joinBracket(foundUser.getUserID); 

       return roomCode; 
    }

    public leaveRoom(userID:number, roomCode:string)
    {
        const foundUser = this.userManager.getUser(userID); 

        try 
        {
            const foundBracket = this.brackets.find((Bracket) => Bracket.getRoomCode() == roomCode);
            if (foundBracket)
            {
                foundBracket.leaveBracket(foundUser.getUserID); 
            }
            else 
            {
                throw new Error("Unable to find bracket specified. Err 005");
            }
        }
        catch (e)
        {
            console.log(e)
        }
    }

    public joinRoom(userID:number, roomCode:string)
    {
        const foundUser = this.userManager.getUser(userID); 

        try 
        {
            const foundBracket = this.brackets.find((Bracket) => Bracket.getRoomCode() == roomCode);
            if (foundBracket)
            {
                foundBracket.joinBracket(foundUser.getUserID); 
            }
            else 
            {
                throw new Error("Unable to find bracket specified. Err 006");
            }
        }
        catch (e)
        {
            console.log(e)
        }
        
    }

    public removeBracket()
    {
        //TODO
        //should only be called by api when match is ended 
    }



}