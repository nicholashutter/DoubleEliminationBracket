/* eslint-disable no-var */
import BracketManager from "./Bracket";
import UserManager from "./user";
import {User} from "./user";
import {Bracket} from "./Bracket";

var bracketManager = BracketManager.getInstance;
var userManager = UserManager.getInstance;

describe ("joinBracket ", () => 
{
    it ("successfully joins user to bracket", () => 
        {
            const bracket = new Bracket();

            for (let i = 0; i < 1000; i++)
            {
                userManager.createUser(`${i}`,``,``,i);
                bracket.joinBracket(i);

            }
            expect(bracket.getBracketSize).toBe(1000); 
        });
});

describe ("leaveBracket", () =>
    {
        it ("successfully removes user from bracket", () =>
        {
            const bracket = new Bracket();

            for (let i = 0; i < 1000; i++)
            {
                userManager.createUser(`${i}`,``,``,i);
                bracket.joinBracket(i);
                bracket.leaveBracket(i);
            }
            expect(bracket.getBracketSize).toBe(0); 
        });
    });