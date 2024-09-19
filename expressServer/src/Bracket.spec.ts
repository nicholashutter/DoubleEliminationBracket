/* eslint-disable no-var */
import BracketManager from "./Bracket";
import UserManager from "./user";
import { User } from "./user";
import { Bracket } from "./Bracket";

var bracketManager = BracketManager.getInstance;
var userManager = UserManager.getInstance;

beforeEach(() => 
{
    userManager.clearUsers();
    bracketManager.clearBrackets();
});

describe("joinBracket ", () => 
{
    it("successfully joins user to bracket", () => 
    {
        const bracket = new Bracket();

        for (let i = 0; i < 1000; i++)
        {
            userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`, i);
            bracket.joinBracket(i);

        }
        expect(bracket.getBracketSize).toBe(1000);
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
            userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`,i);
            const success = bracketManager.joinRoom(i,roomcode);

            expect (success).toBe(true);
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
                userManager.createUser(`User:{i}`, `pw{i}`, `email{i}@email.com`,i);
                bracketManager.joinRoom(i,roomcode);
                
                const success = bracketManager.leaveRoom (i,roomcode);

                expect (success).toBe(true);
            }
    
        });
    });

    