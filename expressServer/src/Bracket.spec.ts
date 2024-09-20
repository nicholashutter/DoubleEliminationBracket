/* eslint-disable no-var */
import BracketManager from "./Bracket";
import UserManager from "./user";
import { User } from "./user";
import { Bracket } from "./Bracket";
import logger from 'jet-logger';

var bracketManager = BracketManager.getInstance;
var userManager = UserManager.getInstance;

beforeEach(() => 
{
    userManager.clearUsers();
    bracketManager.clearBrackets();
    
});

describe("joinBracket ", () => 
{
    it("successfully joins user to bracket, userID inserted", () => 
    {
        const bracket = new Bracket();

        for (let i = 0; i < 1000; i++)
        {
            userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`, i);
            const success = bracket.joinBracket(i);
            if (!success)
            {
                debugger; 
            }
            expect(success).toBe(true );
        }
        
    });
});

describe("joinBracket ", () => 
    {
        it("successfully joins user to bracket, userID generated", () => 
        {
            const bracket = new Bracket();
    
            for (let i = 0; i < 1000; i++)
            {
                const userID = userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`, i);
                const success = bracket.joinBracket(userID);
                if (!success)
                {
                    debugger; 
                }
                expect(success).toBe(true);
            }
            
        });
    });

describe("leaveBracket", () =>
{
    it("successfully removes user from bracket", () =>
    {
        const bracket = new Bracket();

        for (let i = 0; i < 1000; i++)
        {
            userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`, i);
            bracket.joinBracket(i);
            bracket.leaveBracket(i);
        }
        expect(bracket.getBracketSize).toBe(0);
    });
});

describe("generateRoomCode", () =>
{
    it("generates unique room code", () =>
    {
        let previousRoomCode = '';
        for (let i = 0; i < 1000; i++)
        {
            const bracket = new Bracket();
            const roomCode = bracket.getRoomCode;

            expect(roomCode).not.toBe(previousRoomCode);

            previousRoomCode = roomCode;
        }
    });
});

describe("createRoom", () =>
{
    it("creates rooms", () =>
    {
        for (let i = 0; i < 1000; i++)
        {
            bracketManager.createRoom(userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`));

            expect(bracketManager.showAllRooms().length).toBe(i + 1);
        }

    });
});

describe("createRoom", () =>
{
    it("creates unique roomcode", () =>
    {
        let previousRoomCode = '';
        for (let i = 0; i < 1000; i++)
        {
            const roomcode = bracketManager.createRoom(userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`));

            expect(roomcode).not.toBe(previousRoomCode);

            previousRoomCode = roomcode;
        }

    });
});

describe("createRoom", () =>
{
    it("creates unique roomcode", () =>
    {
        let previousRoomCode = '';
        for (let i = 0; i < 1000; i++)
        {
            const roomcode = bracketManager.createRoom(userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`));

            expect(roomcode).not.toBe(previousRoomCode);

            previousRoomCode = roomcode;
        }

    });
});

describe("joinRoom", () =>
{
    it("joins User to selected room", () =>
    {
        const roomcode = bracketManager.createRoom(userManager.createUser('', '', ''));
        for (let i = 0; i < 1000; i++)
        {
            userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`, i);
            const success = bracketManager.joinRoom(i, roomcode);

            expect(success).toBe(true);
        }

    });
});

describe("leaveRoom", () =>
{
    it("removes User from selected room", () =>
    {
        const roomcode = bracketManager.createRoom(userManager.createUser('', '', ''));
        for (let i = 0; i < 1000; i++)
        {
            userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`, i);
            bracketManager.joinRoom(i, roomcode);

            const success = bracketManager.leaveRoom(i, roomcode);

            expect(success).toBe(true);
        }

    });
});

describe("loadPlayers", () =>
{
    it("always return a player who hasn't played", () =>
    {
        
        const bracket = new Bracket();
        bracket.setCurrentRound(0); 
        let player2: any; 
        const localStorage:Array<any> = [];
        for (let i = 0; i < 1000; i++)
        {
            const userID = userManager.createUser(`User: ${i}`, `Pw: ${i}`, `email${i}@email.com`);

            const localUser = userManager.getUser(userID);

            userManager.updateUser(localUser); 

            bracket.joinBracket(userID);

            const player1 = bracket.loadPlayers(); 

            const player2 = localStorage.find ((User) => User.getUserID == localUser.getUserID)


            expect(player2).toBe(undefined); 

            userManager.updateUser(player1);

            localStorage.push(player1);
        }
    });
});

//TODO both joinbracket tests fail at very high indexs in the loop above 950
//loadPlayers suddenly failing by returning an empty user
//loadPlayers is incrementing the user's round inconsistently 

describe("loadPlayers", () =>
{
    it("never return a player who has played", () =>
    {

    });
});

describe("loadPlayers", () =>
{
    it("only returns a player on currentRound", () =>
    {

    });
});

