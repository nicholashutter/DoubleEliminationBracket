import { User } from "./user";
import UserManager from "./user";


describe("getUserID", function ()
{
    it("should return the userID I pass in", function ()
    {   
        const manager = UserManager.getInstance;
        const userID = manager.createUser("","", "", 100);
        const user = manager.getUser(userID);
        expect(user.getUserID).toBe(100); 
    })
});


describe ("createUser", ()=>
{
    it ("should generate a new userID if I do not pass one in", ()=> 
    {
        const manager = UserManager.getInstance;
        const userID = manager.createUser("test", "test", "test");
        const user = manager.getUser(userID);
        expect(user.getUserID).not.toBeUndefined();
    }
    )
})