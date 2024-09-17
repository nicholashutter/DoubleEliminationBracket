/* eslint-disable no-var */
import BracketManager from "./Bracket";
import UserManager from "./user";
import {User} from "./user";

var bracketManager = BracketManager.getInstance;
var userManager = UserManager.getInstance;

describe ("createRoom creates a room", () => 
{
    it ("should find a user and add them to room", () => 
        {
            
            for (let i = 0; i < 1000; i++)
            {
                const roomCode = bracketManager.createRoom(userManager.createUser(`user${i}`, `pw${i}`, `email${i}`));
            }
            expect(bracketManager.showAllRooms.length).toBe(1000); 
        });
});