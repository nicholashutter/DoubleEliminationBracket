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
    static #instance: Session; 

    private constructor(){
        this.db = new DbHandler();
        this.sessionID = uuidv4();
        this.userArr = [];
    }

    public static get instance(): Session{
        if (!Session.#instance){
            Session.#instance = new Session();
        }

        return Session.#instance; 
    }

    public async addUser (user: User): Promise<void> {
        this.userArr.push(user); 
       await this.db.joinSession(user);
    }

    public async removeUser (user: User, searchForID:number): Promise<boolean> {
        
        try {
            await this.db.leaveSession(user);

            this.userArr = this.userArr.filter((user) => user.getUserID() === searchForID); 
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

}