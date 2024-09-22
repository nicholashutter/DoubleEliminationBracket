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


test("joinBracket - successfully joins user to bracket, userID inserted", async () => 
{
    const bracket = new Bracket();

    for (let i = 0; i < 1000; i++)
    {
        userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`, i);
        const success = await bracket.joinBracket(i);
        expect(success).toBe(true);
    }

});


test("joinBracket - successfully joins user to bracket, userID generated", async () => 
{
    const bracket = new Bracket();

    for (let i = 0; i < 1000; i++)
    {
        const userID = userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`, i);
        const success = await bracket.joinBracket(userID);
        expect(success).toBe(true);
    }

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

test("createRoom - it creates rooms", async () =>
    {
        for (let i = 0; i < 1000; i++)
        {
            await bracketManager.createRoom(userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`));

        }
        expect(bracketManager.showAllRooms().length).toBe(1000);
    });


it("createRoom - creates unique roomcode", async () =>
{
    let previousRoomCode = '';
    for (let i = 0; i < 1000; i++)
    {
        const roomcode = await bracketManager.createRoom(userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`));

        expect(roomcode).not.toBe(previousRoomCode);

        previousRoomCode = roomcode;
    }

});


test("createRoom - creates unique roomcode", async () =>
{
    let previousRoomCode = '';
    for (let i = 0; i < 1000; i++)
    {
        const roomcode = await bracketManager.createRoom(userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`));

        expect(roomcode).not.toBe(previousRoomCode);

        previousRoomCode = roomcode;
    }

});


test("joinRoom - joins User to selected room", async () =>
{
    const roomcode = await bracketManager.createRoom(userManager.createUser(`User: ZERO`, `PW: ZERO`, `emailZERO@email.com`));
    for (let i = 0; i < 1000; i++)
    {
        userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`, i);
        const success = await bracketManager.joinRoom(i, roomcode);

        expect(success).toBe(true);
    }

});


test("leaveRoom - removes User from selected room", async () =>
{
    const roomcode = await bracketManager.createRoom(userManager.createUser(`User: ZERO`, `PW: ZERO`, `emailZERO@email.com`));
    for (let i = 0; i < 1000; i++)
    {
        userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`, i);
        bracketManager.joinRoom(i, roomcode);

        const success = await bracketManager.leaveRoom(i, roomcode);

        expect(success).toBe(true);
    }

});



test("loadPlayers - always return a player who hasn't played", async () =>
{


    const bracket = new Bracket();
    bracket.setCurrentRound(0);
    const usersPlayed:Array<User>=[];

    for (let i = 0;i<1000; i++)
    {
        userManager.createUser(`User: ${i}`,`PW: ${i}`,`email${i}@email.com`);
    }
   
    for (let i = 0;i<1000;i++)
    {
        const player1 = await bracket.loadPlayers();
        const player2 = usersPlayed.find(user => player1.getUserID == user.getUserID); //search for this player and if not found add to array
        expect(player2).toBe(undefined);

    }
    
});


test("end to end test 1", async () =>
    {
        //create 1000 users
        //create bracket
        //add users to bracket
        //startSinglesRound()?
        //selectWinner()
        //end
        //

    });