import { User } from "./user";
import UserManager from "./user";


describe("getUserID", function ()
{
    it("should get a randomly generated userID", function ()
    {   
        const manager = UserManager.getInstance;
        const userID = manager.createUser("","", "", 100);
        const user = manager.getUser(userID);
        expect(user.getUserID).toBe(100); 
    })
});

describe ("createUser", ()=>
{
    it ("creates empty user object and adds to Users array", ()=> 
    {
        const manager = UserManager.getInstance;
        const userID = manager.createUser("test", "test", "test");
        const user = manager.getUser(userID);
        expect(user.getUserID).not.toBeUndefined();
    }
    )
})