import {User} from "./user";
import UserManager from "./user";

describe ("getUserID", function () {
    it("get userID", function(){
        const manager = UserManager.getInstance; 
        const userID = manager.createUser("", "", "", 1);
        const user = manager.getUser(userID);
        user.setUserID = 1; 
        expect (user.getUserID).toBe(1); 
    })
}); 