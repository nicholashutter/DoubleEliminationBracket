/* eslint-disable no-debugger */
/* eslint-disable no-var */
import {expect, jest, test} from '@jest/globals';
import { User } from "./user";
import UserManagerManager from "./user";
var userManager = UserManagerManager.getInstance;

beforeEach (() => 
    {
        userManager.clearUsers();
    });

describe ("createUser", () => 
    {
        it ("handles userID conflict by recursively generating userID until unique", () =>
        {
            
            let user1ID:any;
            let user2ID:any;

            for (let i = 0; i < 1000; i++)
            {
                user1ID = userManager.createUser(`${i}`,`i`,``, i);

                user2ID = userManager.createUser(`${i}`,`random`,``);

                if (user1ID == user2ID)
                {
                    debugger;
                }

                expect(user1ID).not.toBe(user2ID);
            }
            
            
        });
    });

describe ("updateUser", ()=>
{
    it("takes in User object and updates its properties accurately", ()=>
    {
        
        const userID = userManager.createUser("ironman","ironman","ironman");
        const localUser = userManager.getUser(userID);
        localUser.setUserName = "incredible hulk"; 
        localUser.setEmail = "incrediblehulk@email.com";

        expect (localUser.getEmail).toBe("incrediblehulk@email.com");
        
    })
});

describe ("updateUser", ()=>
    {
        it("takes in User object, returns object with default properties if matching object not found", ()=>
        {
        
            const localUser = userManager.getUser(Math.random());
            
            expect(localUser.getUserName).toBe("-1");
        })
    });


describe ("getUser", ()=>
{
    it ("will gracefully error when user not found",()=>
    {
            expect(userManager.getUser("weird white guys").getUserID).toBe(-1); 
    })
});

describe("getUser", ()=>
{
    it("successfully finds a user repeatedly (string)",()=>
    {
        for (let i=0; i<500;i++)
        {
            const userID = userManager.createUser(`${i}`,``,``, i);
            const user = userManager.getUser(userID);

            expect(user.getUserName).toBe(`${i}`);
        }
    });
})

describe("getUser", ()=>
    {
        it("successfully finds a user repeatedly (number)",()=>
        {
        
            for (let i=0; i<500;i++)
            {
                const userID = userManager.createUser(`${i}`,``,``, i);
                const user = userManager.getUser(userID);
    
                
                expect(user.getUserID).toBe(i);
            }
        });
    });

describe("clearUsers", () =>
{
    it("correctly clears Users collection between tests", ()=>
    {

        for (let i=0; i<1000;i++)
        {
            userManager.createUser('','','',i);
        }
        userManager.clearUsers();

        expect(userManager.showAllUsers.length).toBe(0);
    });
})

describe ("deleteUser", ()=>
{
    it ("finds a deletes a user -- userID passed in", ()=>
        {

            for (let i = 0;i<1000;i++)
            {
                const userID = userManager.createUser(`${i}`,``,``, i);
                if (userID !== i)
                {
                    debugger; 
                }
                userManager.deleteUser(userID);
            }
            expect(userManager.showAllUsers().length).toBe(0);

        });
});

describe ("deleteUser", ()=>
{
    it ("finds and deletes a user -- userID generated", ()=>
    {

        for (let i = 0;i<1000;i++)
            {
                const userID = userManager.createUser(`${i}`,``,``);
    
                userManager.deleteUser(userID);
            }
            expect(userManager.showAllUsers().length).toBe(0);
    });
});