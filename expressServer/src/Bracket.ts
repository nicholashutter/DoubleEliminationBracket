import UserManager from "./user";
import * as selectDoubleBracket from "./selectDoubleBracket";
import * as selectSingleBracket from "./selectSingleBracket";
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
    protected bracketData: Map<User, Seed>; 
    protected winner; 
    protected roomCode; 
    

    protected constructor()
    {
        this.isRunning = true;
        this.bracketData = new Map();
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
    }

    joinBracket(userID:number)
    {
       const currentUser =  this.userManager.getUser(userID); 

       try
       {
        if (currentUser.getUserName == "-1")
            {
             throw new Error ("Unable to join specified bracket. No matching user found");
            }
        else 
            {
                currentUser.setInGame = true; 
                this.bracketData.set(currentUser, this.generateSeed(this.bracketData.size));
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

    startMatch(numOfPlayers:number, singleOrDouble:string)
    {
        this.isRunning = true

        let totalByes = 0; 
        
        if (numOfPlayers < 2)
            {
                console.log("Failed to start match. Err 003"); 
            }
            else if (numOfPlayers < 5)
            {
                totalByes = 4 - numOfPlayers;
                numOfPlayers = 4; 
            }
            else if (numOfPlayers < 9)
            {
                totalByes = 8 - numOfPlayers;
                numOfPlayers = 9;
            }
            else if (numOfPlayers < 17)
            {
                totalByes = 16 - numOfPlayers;
                numOfPlayers = 16;
            }
            else if (numOfPlayers < 33)
            {
                totalByes = 32 - numOfPlayers;
                numOfPlayers = 32; 
            }

        if (singleOrDouble == "single")
        {
            
            switch (numOfPlayers)
            {
                case 2:
                    return selectSingleBracket.twoPlayers;
                case 4:
                    return selectSingleBracket.fourPlayers;
                case 8:
                    return selectSingleBracket.eightPlayers;
                case 16:
                    return selectSingleBracket.sixteenPlayers;
                case 32:
                    return selectSingleBracket.thirtyTwoPlayers;
                case 64:
                    return selectSingleBracket.sixtyFourPlayers;  
            }
        }
        
        else if (singleOrDouble == "double")
        {
            switch (numOfPlayers)
            {
                case 2:
                    return selectDoubleBracket.twoPlayers;
                case 4:
                    return selectDoubleBracket.fourPlayers;
                case 8:
                    return selectDoubleBracket.eightPlayers;
                case 16:
                    return selectDoubleBracket.sixteenPlayers;
                case 32:
                    return selectDoubleBracket.thirtyTwoPlayers;
                case 64:
                    return selectDoubleBracket.sixtyFourPlayers; 
                    
            }
        }

        this.bracketData.size 

        const sortedArray = Array.from(this.bracketData).sort((a,b) => a[1] -b[1]);

        const [player1, player2] = Array.from(sortedArray).slice(0,2);

        return {player1, player2};
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

    }

    get getRoomCode ()
    {
        return this.roomCode;
    }

}

export default class BracketManager extends Bracket
{
    
    static #instance: BracketManager;

    private brackets: Array <User>;  

    private constructor()
    {
        super();
        this.brackets = new Array <User>();
         
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