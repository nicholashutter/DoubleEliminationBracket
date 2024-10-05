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


test("leaveBracket - successfully removes user from bracket", async () => 
    {
        const bracket = new Bracket();

        for (let i = 0; i < 1000; i++)
        {
            userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`, i);
            await bracket.joinBracket(i);
            await bracket.leaveBracket(i);
        }
        expect(bracket.getBracketSize).toBe(0);
    
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
    const usersPlayed: Array<User> = [];

    for (let i = 0; i < 1000; i++)
    {
        userManager.createUser(`User: ${i}`, `PW: ${i}`, `email${i}@email.com`);
    }

    for (let i = 0; i < 1000; i++)
    {
        const player1 = await bracket.loadPlayers();
        const player2 = usersPlayed.find(user => player1.getUserID == user.getUserID); //search for this player and if not found add to array
        expect(player2).toBe(undefined);

    }

});


test("isRunning flag", async () =>
    {
        const roomCode = await bracketManager.createRoom(userManager.createUser('User: One', 'PW: One', 'emailOne@email.com'));

    for (let i = 0; i < 33; i++)
    {
        const userID = userManager.createUser(`{i}`, `{i}`, `{i}`);

        bracketManager.joinRoom(userID, roomCode);
    }

    await bracketManager.startSinglesMatch(roomCode);

    await bracketManager.selectWinner(roomCode, "player1");

    expect(bracketManager.getIsRunning(roomCode) === true); 
    });






 /* 
        create users
        join users to room 
        start match 
        start loop
        start round 
        select players
        select winner
        end round
        update players
        end loop
        end match
        update players
    */

    /*
        create room, store room code
        loop
            create users 32
            join to room 
        end loop 
        start match
        start loop
            start round
            select winner
            end round
        update players
        end match
        end loop
        update players
    */



  
test("end to end singles test", async () =>
{
   

    //create room
    const roomCode = await bracketManager.createRoom(userManager.createUser('User: One', 'PW: One', 'emailOne@email.com'));
    
    //create users
    for (let i = 0; i < 33; i++)
    {
        const userID = userManager.createUser(`{i}`, `{i}`, `{i}`);

        await bracketManager.joinRoom(userID, roomCode);
    }

    //start match and choose match type
    await bracketManager.startSinglesMatch(roomCode);

    //after first round wait for response from client
    bracketManager.selectWinner(roomCode, "player1");

    //run the rounds as a loop until the match is ended
    if (bracketManager.getIsRunning(roomCode) === true)
    {
         
        while(bracketManager.getIsRunning(roomCode) === true)
        {
        
            await bracketManager.startSinglesMatch(roomCode);
            
            bracketManager.selectWinner(roomCode, "player1");
        }
    }
     
    else 
    {
        console.log("Test Failed"); 
    }
    
});  