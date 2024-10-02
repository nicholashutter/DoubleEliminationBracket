
import UserManager from "./user";
import { User } from "./user";
import crypto from "crypto";


type Seed = number;
type matchType = "single" | "double" | "default"
/*
Run the bracket and update users
*/
export class Bracket
{
    private player1: User|null;
    private player2: User|null;
    private userManager: UserManager;
    private isRunning: boolean;
    private winner;
    private roomCode;
    private totalByes;
    private numOfPlayers;
    private users: Map<User, Seed>;
    private currentRound;
    private finalRound;
    private matchType: matchType;
    private fault: number; 

    constructor()
    {
        const generateRoomCode = () =>
        {
            const salt = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            let returnValue = '';
            for (let i = 0; i < 2; i++)
            {
                returnValue += salt[crypto.randomInt(salt.length)];
            }

            for (let i = 0; i < 3; i++)
            {
                returnValue += crypto.randomInt(10).toString();
            }

            returnValue += salt[crypto.randomInt(salt.length)];

            return returnValue;
        }

        this.isRunning = false;
        this.users = new Map();
        this.winner = {
            player1: 0,
            player2: 0,
            currentVotes: 0,
        }

        this.roomCode = generateRoomCode();
        this.userManager = UserManager.getInstance;
        this.player1 = null;
        this.player2 = null;
        this.totalByes = 0;
        this.numOfPlayers = 0;
        this.currentRound = 0;
        this.matchType = "default";
        this.finalRound = 0;
        this.fault = 0; 
    }

    get getBracketSize()
    {

        const localUsers = this.users
        return localUsers.size;
    }

    get getRoomCode()
    {
        return this.roomCode;
    }

    get getIsRunning()
    {
        const localIsRunning = this.isRunning;
        return localIsRunning;
    }
    async joinBracket(userID: number)
    {

        const currentUser = await this.userManager.getUser(userID);


        if (currentUser === undefined)
        {

            throw new Error("Unable to join bracket. Err 038");
        }

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

                return true;

            }
        }
        catch (e)
        {
            console.log(e);

        }

    }

    async leaveBracket(userID: number)
    {
        const currentUser = await this.userManager.getUser(userID);

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

    private generateSeed = (count: number) =>
    {
        const randomID = Math.floor(Math.random() * 1000) + Date.now();

        this.users.forEach((seed, user) =>
        {
            if (seed == randomID)
            {
                if (count > 1000)
                {
                    throw new Error("RandomID could not be generated. Fatal. Err 101");
                }
                this.generateSeed(count + 1);
            }
        })

        return randomID;
    }
    /*untested */
    private setSinglesByes()
    { //called by startSinglesRound 
        //modifys this.totalByes and this.numOfPlayers
        if (this.numOfPlayers < 2)
        {
            console.log("Unable to begin tournament with less than two players. Err 003");
        }
        else if (this.numOfPlayers < 3)
        {
            this.totalByes = 2 - this.numOfPlayers;
            this.numOfPlayers = 2
            /* 
            log base 2 of N 
            or what power of 2 gives N 
            1 round as much as 1 bye
            */
            this.finalRound = 1;
        }
        else if (this.numOfPlayers < 5)
        {
            this.totalByes = 4 - this.numOfPlayers;
            this.numOfPlayers = 4;
            this.finalRound = 2;

        }
        else if (this.numOfPlayers < 9)
        {
            this.totalByes = 8 - this.numOfPlayers;
            this.numOfPlayers = 8;
            this.finalRound = 3;
        }
        else if (this.numOfPlayers < 17)
        {
            this.totalByes = 16 - this.numOfPlayers;
            this.numOfPlayers = 16;
            this.finalRound = 4;
        }
        else if (this.numOfPlayers < 33)
        {
            this.totalByes = 32 - this.numOfPlayers;
            this.numOfPlayers = 32;
            this.finalRound = 5;
        }
    }

    private setDoubleByes()
    { //called by startSinglesRound 
        //modifys this.totalByes and this.numOfPlayers
        if (this.numOfPlayers < 2)
        {
            console.log("Unable to begin tournament with less than two players. Err 003");
        }
        else if (this.numOfPlayers < 3)
        {
            this.totalByes = 2 - this.numOfPlayers;
            this.numOfPlayers = 2
            /* 
            finalRound should be 2N-2 
            */
            this.finalRound = 2;
        }
        else if (this.numOfPlayers < 5)
        {
            this.totalByes = 4 - this.numOfPlayers;
            this.numOfPlayers = 4;
            this.finalRound = 6;

        }
        else if (this.numOfPlayers < 9)
        {
            this.totalByes = 8 - this.numOfPlayers;
            this.numOfPlayers = 8;
            this.finalRound = 14;
        }
        else if (this.numOfPlayers < 17)
        {
            this.totalByes = 16 - this.numOfPlayers;
            this.numOfPlayers = 16;
            this.finalRound = 30;
        }
        else if (this.numOfPlayers < 33)
        {
            this.totalByes = 32 - this.numOfPlayers;
            this.numOfPlayers = 32;
            this.finalRound = 62;
        }
    }
    /*untested */
    private async applyByes()
    {   //This function called by both startSinglesRound and startDoublesRound
        //uses the result from setSinglesByes to apply bye rounds
        for (let i = 0; i < this.totalByes; i++)
        {
            await this.loadPlayers() as User;
        }
    }
    async loadPlayers()
    {
        let low = 0;
        const localUserID = this.userManager.createUser(`User ${low}`, `PW ${low}`, `email${low}@email.com`);
        let player1 = await this.userManager.getUser(localUserID);
        this.userManager.deleteUser(localUserID);

        const findUser = () =>
        {
            this.users.forEach((seed, user) =>
            {
                if (low < seed)
                {
                    low = seed;
                    if (low == seed)
                    {

                        player1 = user;
                    }
                }

            })
        }

        findUser();

        if (player1.getRound !== this.currentRound)
        {
            findUser();
        }

        player1.setRound = player1.getRound + 1;
        this.userManager.updateUser(player1);
        return player1;
    }


    
    async startMatch(matchType: matchType)
    {
        this.matchType = matchType;
        this.isRunning = true;
        this.applyByes();

        switch (matchType)
        {
            case "single":
                this.setSinglesByes();
                break;

            case "double":
                this.setDoubleByes();
                break;

            case "default":
                console.log("Invalid argument for startMatch. Err 037");
                break;
        }

    }
    /*untested */
    async startSinglesRound()
    {
        if (this.isRunning === false)
        {
            throw new Error("Failed to initialize isRunning. Bracket either not running or failed to launch Err 041"); 
        }

        this.matchType = "single";
        this.currentRound = this.currentRound + 1;
        this.numOfPlayers = this.users.size

        const player1 = await this.loadPlayers() as User;
        const player2 = await this.loadPlayers() as User;

        this.player1 = player1 as User;
        this.player2 = player2 as User;

        this.player1.setEliminations = 0;
        this.player2.setEliminations = 0;

    }
    /*untested */
    async startDoublesRound()
    {
        if (this.isRunning === false)
            {
                throw new Error("Failed to initialize isRunning. Bracket either not running or failed to launch Err 041"); 
            }

        this.matchType = "double";
        this.currentRound = this.currentRound + 1;
        this.numOfPlayers = this.users.size;

        const player1 = await this.loadPlayers() as User;
        const player2 = await this.loadPlayers() as User;

        this.player1 = player1 as User;
        this.player2 = player2 as User;
    }

    public setCurrentRound(value: number)
    {
        //debug
        this.currentRound = value;
    }



    /*untested */
    async selectWinner(winner: string)
    {

        try
        {
            switch (winner)
            {
                case "player1":
                    this.winner.player1 = this.winner.player1 + 1;
                    this.winner.currentVotes = this.winner.currentVotes + 1;
                    break;

                case "player2":
                    this.winner.player2 = this.winner.player2 + 1;
                    this.winner.currentVotes = this.winner.currentVotes + 1;
                    break;

                default:
                    console.log("Invalid argument");
                    break;
            }

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
                this.winner.currentVotes = 0;
                this.winner.player1 = 0;
                this.winner.player2 = 0;
                throw new Error(`currentVotes variable greater than 2. 
                        This should not be possible. Attempting to self heal. Cast votes again. Err 011`);

            }
        }
        catch (e)
        {
            console.log(e);
        }


        if (this.isRunning === true)
        {
            switch (this.matchType)
            {
                case "single":
                    await this.startSinglesRound();
                    break;

                case "double":
                    await this.startDoublesRound();
                    break;
                case "default":
                    throw new Error(`Cannot determine what type of round to start next or bracket not propertly initialized. 
                        Fatal error. Err 017`);
            }
        }
        else
        {
            
            throw new Error("Failure to read matchType variable. Err 040");
        }
    }
    /*untested */
    async endRound(winner: string)
    {//called by selectWinner
         
        const winningUser = await this.userManager.getUser(winner);
        winningUser.setAllTimeWins = winningUser.getAllTimeWins + 1;
        try 
        {
            if (winningUser.getUserName == "-1" || winningUser === undefined)
            {
                await this.endMatch();
            }
        }
        catch (e)
        {
            console.log(e);
        }


    }
    /*untested */
    async endMatch()
    {
        
        this.fault = this.fault + 1; 
       /* if (this.fault > 0)
        {
            throw new Error("FATAL ERR. Scenario: endMatch called more than 1x.");
        } */
        this.users.forEach(async (value, User) =>
        {
            User.setInGame = false;
            User.setRound = 0;
            const localUser = await this.userManager.getUser(User.getUserID);
            this.userManager.updateUser(localUser);
        })
        this.isRunning = false;
        this.currentRound = 0;
        this.matchType = "default";
        this.player1 = null;
        this.player2 = null;
        this.totalByes = 0;

        //since bracketManger is global, and since bracket can modify it's state
        //need to pass some signal that this bracketmatch is finished
        // and propogate it up 

        
        throw new Error("Program Terminated by endMatch() call.")

    }



}

export default class BracketManager 
{

    static #instance: BracketManager;
    private brackets: Array<Bracket>;
    private userManager: UserManager;

    private constructor()
    {
        this.brackets = new Array<Bracket>();
        this.userManager = UserManager.getInstance;
    }

    static get getInstance(): BracketManager
    {
        if (!BracketManager.#instance)
        {
            BracketManager.#instance = new BracketManager();
        }

        return BracketManager.#instance;
    }

    public showAllRooms()
    {
        /* debug */
        const snapShot = this.brackets;



        return snapShot;
    }

    public clearBrackets()
    {
        /* debug */
        this.brackets = [];
    }

    async createRoom(userID: number)
    {
        const foundUser = await this.userManager.getUser(userID);

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

        await currentBracket.joinBracket(foundUser.getUserID);

        return roomCode;
    }

    async leaveRoom(userID: number, roomCode: string)
    {
        const foundUser = await this.userManager.getUser(userID);

        try 
        {
            const foundBracket = this.brackets.find((Bracket) => Bracket.getRoomCode == roomCode);

            if (foundBracket)
            {
                await foundBracket.leaveBracket(foundUser.getUserID);
                return true;
            }
            else 
            {
                return false;
                throw new Error("Unable to find bracket specified. Possible Null or incorrect type. Err 005");
            }
        }

        catch (e)
        {
            console.log(e)
        }
    }

    async joinRoom(userID: number, roomCode: string)
    {
        const foundUser = await this.userManager.getUser(userID);

        try 
        {
            const foundBracket = this.brackets.find((Bracket) => Bracket.getRoomCode == roomCode);

            if (foundBracket !== undefined)
            {
                await foundBracket.joinBracket(foundUser.getUserID);
                return true;
            }

            else 
            {
                return false;
                throw new Error("Unable to find bracket specified. Err 006");
            }
        }

        catch (e)
        {
            console.log(e)
        }

    }

    async startSinglesMatch(roomCode: string)
    {
        await this.startSinglesRound(roomCode);
    }

    async startSinglesRound(roomCode: string)
    {
        try
        {
            const localBracket = this.brackets.find((bracket) => bracket.getRoomCode == roomCode);

            if (localBracket === undefined)
            {
                throw new Error("No bracket found with that roomCode. Err 033");
            }

            else
            {
                await localBracket.startMatch("single");

            }
        }
        catch (e)
        {
            console.log(e)
        }

    }

    async startDoublesMatch(roomCode: string)
    {
       await this.startDoublesRound(roomCode);
    }

    async startDoublesRound(roomCode: string)
    {
        try
        {
            const localBracket = this.brackets.find((bracket) => bracket.getRoomCode == roomCode);

            if (localBracket === undefined)
            {
                throw new Error("No bracket found with that roomCode. Err 033");
            }

            else
            {
               await localBracket.startSinglesRound();

            }
        }
        catch (e)
        {
            console.log(e)
        }

    }

    async selectWinner(roomCode:string, winner:string)
    {
        try
        {
            const localBracket = this.brackets.find((bracket) => bracket.getRoomCode == roomCode);

            if (localBracket === undefined)
            {
                throw new Error("No bracket found with that roomCode. Err 033");
            }

            else
            {
                await localBracket.selectWinner(winner);
                await localBracket.endRound(winner);
            }
        }
        catch (e)
        {
            console.log(e);
        }
    }

    getIsRunning(roomCode:string)
    {
        try
        {
            const localBracket = this.brackets.find((bracket) => bracket.getRoomCode == roomCode);

            if (localBracket === undefined)
            {
                throw new Error("No bracket found with that roomCode. Err 039");
            }

            else
            {
                return localBracket.getIsRunning;
            }
        }
        catch (e)
        {
            console.log(e);
        }
    }
}