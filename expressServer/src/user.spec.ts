/* eslint-disable no-var */
import {expect, jest, test} from '@jest/globals';
import { User } from "./user";
import UserManager from "./user";
var manager = UserManager.getInstance;


describe ("createUser", () => 
    {
        it ("handles userID conflict by recursively generating userID until unique", () =>
        {
            
            let user1ID:any;
            let user2ID:any;

            for (let i = 0; i < 1000; i++)
            {
                user1ID = manager.createUser(`${i}`,`i`,``, i);

                user2ID = manager.createUser(`${i}`,`random`,``);

                expect(user1ID).not.toBe(user2ID);
            }
            
            
        });
    });

describe ("updateUser", ()=>
{
    it("takes in User object and updates its properties accurately", ()=>
    {
        
        const userID = manager.createUser("ironman","ironman","ironman");
        const localUser = manager.getUser(userID);
        localUser.setUserName = "incredible hulk"; 
        localUser.setEmail = "incrediblehulk@email.com";

        expect (localUser.getEmail).toBe("incrediblehulk@email.com");
        
    })
});

describe ("updateUser", ()=>
    {
        it("takes in User object, returns object with default properties if matching object not found", ()=>
        {
            
            
            const localUser = manager.getUser(Math.random());
            
            expect(localUser.getUserName).toBe("-1");
        })
    });


describe ("getUser", ()=>
{
    it ("will gracefully error when user not found",()=>
    {
            expect(() => manager.getUser("weird white guys")).toThrow(); 
    })
});

describe("getUser", ()=>
{
    it("successfully finds a user repeatedly (string)",()=>
    {
        for (let i=0; i<1000;i++)
        {
            const userID = manager.createUser(`${i}`,``,``, i);
            const user = manager.getUser(userID);

            expect(user.getUserName).toBe(`${i}`);
        }
    });
})

describe("getUser", ()=>
    {
        it("successfully finds a user repeatedly (number)",()=>
        {
            for (let i=0; i<1000;i++)
            {
                const userID = manager.createUser(`${i}`,``,``, i);
                const user = manager.getUser(userID);
    
                expect(user.getUserID).toBe(i);
            }
        });
    });

describe ("deleteUser", ()=>
{
    it ("finds a user and deletes the user repeatedly", ()=>
        {
            for (let i = 0;i<1000;i++)
            {
                const userID = manager.createUser(`${i}`,``,``, i);
                manager.deleteUser(userID);
            }
            expect(manager.showAllUsers().length).toBe(0);

        });
});