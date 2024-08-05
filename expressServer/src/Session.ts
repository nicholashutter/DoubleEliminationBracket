import express from 'express';
import session from "express-session";
import {v4 as uuidv4} from "uuid";
import DbHandler from './DbHandler';
import {User} from "./user"; 

export class Session 
{
    protected db: DbHandler;
    protected sessionID: string;
    protected userArr: Array<User>;
    constructor(){
        db = new DbHandler();
        this.sessionID = uuidv4();
        this.userArr = [];
    }

    public addUser (user: User): void {
        this.userArr.push(user); 

        //this function will also call dbHandler.joinSession(User)
    }

    public async removeUser (user: User): boolean {
        user = await this.db.readUser(user);

        //some function call or arrow function  to search this.userArr and return user object with matching id 
        // if user id matches remove user from both this.userArr and call dbHandler.leaveSession(User)
    }

}