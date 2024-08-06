import express from 'express';
import session from "express-session";
import {v4 as uuidv4} from "uuid";
import DbHandler from './DbHandler';
import {User} from "./user"; 

export class SessionManager{

    protected sessArr:Array<Session>;
    static #instance: SessionManager;

    private constructor (){
        this.sessArr = [];

    }

    public static get instance(): SessionManager{
        if (!SessionManager.#instance){
            SessionManager.#instance = new SessionManager();
        }

        return SessionManager.#instance; 
    }

    async createSession (user:User):  Promise<string> {
        const currentSession:Session = await Session.init(user); 

        this.sessArr.push(currentSession);
        
        return currentSession.SessionID; 
    }

    async joinSession(searchForID: string, user:User):Promise<void>{


        const currentSession = this.sessArr.find(Session => Session.SessionID === searchForID);
        
        if (currentSession){
            await currentSession.addUser(user);
        }
        else {console.log("No session found")}; 

    }
}

export class Session 
{
    protected db: DbHandler;
    protected sessionID: string;
    protected userArr: Array<User>;

    private constructor(){
        this.db = new DbHandler();
        this.sessionID = uuidv4();
        this.userArr = [];
    }

    public static async init(user:User):Promise<Session>{
        const currentSession:Session = new Session();
        const db = new DbHandler();
        await db.createSession(currentSession.SessionID, user);
        return currentSession; 
    }

    public get SessionID(): string {
        return this.sessionID;
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