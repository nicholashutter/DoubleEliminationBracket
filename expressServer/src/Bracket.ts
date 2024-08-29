import UserManager from "./user";
import { User } from "./user";
import crypto from "crypto";
type Seed = number;


/*
Run the bracket and update users
*/
class Bracket
{
    userManager: UserManager;
    isRunning: boolean;
    //each bracket should have bracketData holding users and their seed values
    protected users: Map<User, Seed>;
    protected winner;
    protected roomCode;
    protected totalByes;
    protected numOfPlayers;
    protected player1:User; 
    protected player2:User;
    protected currentRound; 


    protected constructor()
    {
        this.isRunning = true;
        this.users = new Map();
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
        this.currentRound = 0; 
        this.player1 = this.userManager.getUser(this.userManager.createUser("","","", 0)); 
        this.player2 = this.userManager.getUser("");
    }

    joinBracket(userID: number)
    {
        const currentUser = this.userManager.getUser(userID);

        try
        {
            if (currentUser.getUserName == "-1")
            {
                throw new Error("Unable to join specified bracket. No matching user found. Err 007");
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

    leaveBracket(userID: number)
    {
        const currentUser = this.userManager.getUser(userID);

        try
        {
            if (currentUser.getUserName == "-1")
            {
                throw new Error("Unable to join specified bracket. No matching user found. Err 008");
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

    private generateSeed(value: number)
    {
        return Math.floor(Math.random() * value);
    }

    private calculateByes()
    {
        if (this.numOfPlayers < 3)
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
    }

    private applyByes()
    {
        for (let i = 0; i < this.totalByes; i++)
        {
            const userSkipsRound = this.loadPlayers() as User; 
            userSkipsRound.setRound = userSkipsRound.getRound + 1;
        }
    }

    startSinglesRound()
    {
        this.isRunning = true
        this.currentRound = this.currentRound + 1;
        this.numOfPlayers = this.users.size
        this.calculateByes();
        this.applyByes();

        const player1 = this.loadPlayers() as User;
        const player2 = this.loadPlayers() as User;

        return { player1, player2 }
    }

    startDoublesRound()
    {
        this.isRunning = true
        this.currentRound = this.currentRound + 1;
        this.numOfPlayers = this.users.size
        this.calculateByes();
        this.applyByes();

        const player1 = this.loadPlayers() as User;
       
        const player2 = this.loadPlayers() as User;
       


        return {player1, player2}
    }

   private loadPlayers()
    {
        let low = 0;
        const localUserID = this.userManager.createUser("", "", "");
        let player1 = this.userManager.getUser(localUserID); 

        const findUser = () =>
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

        findUser();

        if (player1.getInGame == true && this.currentRound !== player1.getRound)
        {
            
            for (let i = 0; player1.getInGame == true && this.currentRound !== player1.getRound; i++)
            {
                findUser();

                if (i == this.users.size + 1)
                {
                    player1.setUserName = "-1"; 
                    break; 
                }  
            }
        }
        this.userManager.deleteUser(localUserID);
        player1.setInGame = true;
        player1.setRound = player1.getRound + 1; 
        return player1;
    }

    endRound(winner: string)
    {
        const winningUser = this.userManager.getUser(winner);
        winningUser.setAllTimeWins = winningUser.getAllTimeWins + 1;
        try 
        {
            if (winningUser.getUserName == "-1")
            {
                this.endMatch(); 
                throw new Error(`Unable to find user who is 
                    either inGame or on currentRound. Is bracket over?`);
            }
        }
        catch (e)
        {
            console.log(e);
        }

        
    }

    endMatch ()
    {
        this.users.forEach((value, key) =>
            {
                key.setInGame = false;
                key.setRound = 0;
            })
        this.isRunning = false;
        this.currentRound = 0;

        this.users.forEach((value, key)=>
        {
            const player1 = this.userManager.getUser(key.getUserID)

            this.userManager.updateUser(player1);
        })
    }

    selectWinner(winner:string)
    {
        switch (winner)
        {
            case "player1":
                this.winner.player1 = this.winner.player1 + 1;
                this.winner.currentVotes = this.winner.currentVotes +1;
                break;

            case "player2":
                this.winner.player2 = this.winner.player2 +1;
                this.winner.currentVotes = this.winner.currentVotes +1;
                break;

            default:
                console.log("Invalid argument");
                break;
        }
        try
        {
            if (this.winner.currentVotes == 2)
                {
                    if (this.winner.player1 == 2)
                    {
                        this.endRound("player1");
                        this.winner.currentVotes = 0;
                    }
                    else if (this.winner.player2 == 2)
                    {
                        this.endRound("player2");
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
            else if (this.winner.currentVotes > 2)
                {
                    throw new Error(`currentVotes variable greater than 2. 
                        This should not be possible. Attempting to self heal. Cast votes again. Err 011`);
                        this.winner.currentVotes = 0; 
                } 
        }
        catch (e)
        {
            console.log(e); 
        }
        
        //TODO updateUsers and load new users if ISrunning == true
    }

    get getRoomCode()
    {
        return this.roomCode;
    }

}

export default class BracketManager extends Bracket
{

    static #instance: BracketManager;

    private brackets: Array<Bracket>;

    private constructor()
    {
        super();
        this.brackets = new Array<Bracket>();

    }
    public static get getInstance(): BracketManager
    {
        if (!BracketManager.#instance)
        {
            BracketManager.#instance = new BracketManager();
        }

        return BracketManager.#instance;
    }

    public createRoom(userID: number)
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

    public leaveRoom(userID: number, roomCode: string)
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

    public joinRoom(userID: number, roomCode: string)
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