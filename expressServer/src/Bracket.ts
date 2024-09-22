
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
    userManager: UserManager;
    isRunning: boolean;
    //each bracket should have bracketData holding users and their seed values
    protected users: Map<User, Seed>;
    protected winner;
    protected roomCode;
    protected totalByes;
    protected numOfPlayers;

    protected currentRound;
    protected matchType: matchType;


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

        this.isRunning = true;
        this.users = new Map();
        this.winner = {
            player1: 0,
            player2: 0,
            currentVotes: 0,
        }

        this.roomCode = generateRoomCode();
        this.userManager = UserManager.getInstance;
        this.totalByes = 0;
        this.numOfPlayers = 0;
        this.currentRound = 0;
        this.matchType = "default";
    }

    get getBracketSize()
    {

        const localUsers = this.users
        return localUsers.size;
    }


    async joinBracket(userID: number)
    {

        const currentUser = await this.userManager.getUser(userID);


        if (currentUser === undefined)
        {

            throw new Error("ERR 222 FATAL");
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
    /*semi - tested */

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
    /*untested */
    private async applyByes()
    {
        for (let i = 0; i < this.totalByes; i++)
        {
            const userSkipsRound = await this.loadPlayers() as User;
            userSkipsRound.setRound = userSkipsRound.getRound + 1;
        }
    }
    /*untested */
    async startSinglesRound()
    {
        this.isRunning = true;
        this.matchType = "single";
        this.currentRound = this.currentRound + 1;
        this.numOfPlayers = this.users.size
        this.calculateByes();
        this.applyByes();

        const player1 = await this.loadPlayers() as User;
        const player2 = await this.loadPlayers() as User;

        return { player1, player2 }
    }
    /*untested */
    async startDoublesRound()
    {
        this.isRunning = true
        this.matchType = "double";
        this.currentRound = this.currentRound + 1;
        this.numOfPlayers = this.users.size
        this.calculateByes();
        this.applyByes();

        const player1 = await this.loadPlayers() as User;

        const player2 = await this.loadPlayers() as User;



        return { player1, player2 }
    }
    /*untested */

    public setCurrentRound(value: number)
    {
        //debug
        this.currentRound = value;
    }

    public async loadPlayers()
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
    /*untested */
    async endRound(winner: string)
    {
        const winningUser = await this.userManager.getUser(winner);
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
    /*untested */
    async endMatch()
    {
        this.users.forEach(async (value, key) =>
        {
            key.setInGame = false;
            key.setRound = 0;
        })
        this.isRunning = false;
        this.currentRound = 0;
        this.matchType = "default";

        this.users.forEach(async (value, key) =>
        {
            const player1 = await this.userManager.getUser(key.getUserID)

            this.userManager.updateUser(player1);
        })
    }
    /*untested */
    selectWinner(winner: string)
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
                this.winner.currentVotes = 0;
                throw new Error(`currentVotes variable greater than 2. 
                        This should not be possible. Attempting to self heal. Cast votes again. Err 011`);

            }
        }
        catch (e)
        {
            console.log(e);
        }


        if (this.isRunning)
        {
            switch (this.matchType)
            {
                case "single":
                    this.startSinglesRound();
                    break;

                case "double":
                    this.startDoublesRound();
                    break;
                case "default":
                    throw new Error(`Cannot determine what type of round to start next or bracket not propertly initialized. 
                        Fatal error. Err 017`);
            }
        }
    }

    get getRoomCode()
    {
        return this.roomCode;
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

    public static get getInstance(): BracketManager
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

    public async createRoom(userID: number)
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

        currentBracket.joinBracket(foundUser.getUserID);

        return roomCode;
    }

    public async leaveRoom(userID: number, roomCode: string)
    {
        const foundUser = await this.userManager.getUser(userID);

        try 
        {
            const foundBracket = this.brackets.find((Bracket) => Bracket.getRoomCode == roomCode);

            if (foundBracket)
            {
                foundBracket.leaveBracket(foundUser.getUserID);
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

    public async joinRoom(userID: number, roomCode: string)
    {
        const foundUser = await this.userManager.getUser(userID);

        try 
        {
            const foundBracket = this.brackets.find((Bracket) => Bracket.getRoomCode == roomCode);

            if (foundBracket)
            {
                foundBracket.joinBracket(foundUser.getUserID);
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

}