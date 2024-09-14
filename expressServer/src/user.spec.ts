import { User } from "./user";
import UserManager from "./user";




describe ("createUser", ()=>
{
    it ("should generate a new userID if I do not pass one in", ()=> 
    {
        const manager = UserManager.getInstance;
        const userID = manager.createUser("luigi", "luigipw", "luigiemail");
        const localUser = manager.getUser(userID);
        expect(localUser.getUserID).not.toBeUndefined();
    }
    )
});

describe ("createUser", ()=>
{
    it ("should create the user based on properties I send in", ()=>
    {
        const manager = UserManager.getInstance;
        const userID = manager.createUser("black panther", "black panther", "blackpanther@email.com" );
        const localUser = manager.getUser(userID);

        expect(localUser.getUserName).toBe("black panther");
        expect(localUser.getEmail).toBe("blackpanther@email.com");
    })
})

describe ("createUser", ()=>
{
    it ("should always generate a new fresh userID", ()=>
    {
        const manager = UserManager.getInstance;
        for (let i=0; i<500; i++)
        {
            const userID = manager.createUser("test1","test1", "test1");
            const user2ID = manager.createUser("test2", "test2", "test2");

            expect (userID).not.toBe(user2ID);
        }
    })
})

describe ("updateUser", ()=>
{
    it("takes in User object and updates its properties accurately", ()=>
    {
        const manager = UserManager.getInstance;
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
            const manager = UserManager.getInstance;
            
            const localUser = manager.getUser(Math.random());
            
            expect(localUser.getUserName).toBe("-1");
        })
    });

describe ("getUser", ()=>
{
    it ("takes userName string in and returns user object", ()=>
    {
        const manager = UserManager.getInstance;

        manager.createUser("thor", "thor", "thor");

        const localUser = manager.getUser("thor");

        expect (localUser.getUserName).toBe("thor");
    })
});


describe ("getUser", ()=>
{
    it ("will gracefully error when user not found",()=>
    {
            const manager = UserManager.getInstance;

            expect(() => manager.getUser("weird white guys")).toThrow(); 
    })
});

describe("getUser", ()=>
    {
        it("should return the userID I pass in", ()=>
        {   
            const manager = UserManager.getInstance;
            const userID = manager.createUser("mario","mariopw", "mario@email.com", 2000);
            const user = manager.getUser(userID);
            expect(user.getUserID).toBe(2000); 
        })
    });

describe("getUser", ()=>
{
    it("should return User with matching properties", ()=>
    {
        const manager = UserManager.getInstance;
        const userID = manager.createUser("wario", "wariopw", "wario@email.com", 1500);
        const foundUser = manager.getUser(userID);

        expect(foundUser.getUserID).toBe(1500);
        expect(foundUser.getUserName).toBe("wario");
        expect(foundUser.getEmail).toBe("wario@email.com");
    })
})


describe ("deleteUser",()=>
{
    it ("finds a user based on userID and deletes the user",()=>
    {
        const manager = UserManager.getInstance;

        const userID = manager.createUser("tony stark", "nick fury", "the punisher");

        const localUser = manager.getUser(userID);

        manager.deleteUser(userID);

        const blankUser = manager.getUser(userID);

        expect(blankUser.getUserName).toBe("-1"); 

    })
})

