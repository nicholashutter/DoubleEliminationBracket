class User {
    protected id: number = 0;
    protected username: string ="";
    protected email: string ="";
    //plain text for initial development will be converted when encryption library is created
    protected passwordHash: string = "";

    
    protected createdAt: Date = new Date();
    protected updatedAt: Date = new Date();


    constructor(username:string, passwordHash:string,email:string ){
        const getRandomInt = (max:number) => {
            return Math.floor(Math.random()*max);
        }
        this.id = getRandomInt(10000);
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = new Date();
        this.updatedAt = new Date(); 
      }

    getUserId = ():number => { return this.id;}

    getUserName = ():string => {return this.username; }

    getEmail = ():string => {return this.email;}

    getLastUpdate = ():string=> {return this.updatedAt.toLocaleString();}

    getCreatedAt = ():string => {return this.updatedAt.toLocaleString();}

    setLastUpdate =(Date:Date):void => {this.updatedAt = Date;}

    setUserName = (username:string):void => {this.username = username;}


    setEmail = (email:string):void => {this.email = email;}

    setPasswordHash = (passwordHash:string):void => {this.passwordHash = passwordHash}; 

}

export default class userWrapper {
    protected currentUser:User; 
    constructor (username:string, passwordHash:string, email:string){
        
        if (email.includes("@") && email.includes(".")) {
            this.currentUser = new User(username, passwordHash, email); 
        }
        else if (
            username == null || passwordHash == null || email == null|| username === null || passwordHash === null || email === null
            || username == undefined || passwordHash == undefined || email == undefined || username === undefined || passwordHash === undefined
            || email === undefined

        )  {
            throw new Error("user.ts 56 cannot create user safely some parameters are null or undefined");
        }
        else {
            throw new Error("user.ts: 59 email not in a valid format");
        }

        
    }

    getUserId = ():number => {return this.currentUser.getUserId(); }

    getUserName = ():string => {return this.currentUser.getUserName();}

    //for now typescript inference type checking will be acceptable, but later I will explicitly define the promise return type
    //once the dbHandler class is built
    setUsername = async (username:string) => {
        //we have declared this function async because later I will query the database to see if this username already
        //exists and await the response
        this.currentUser.setUserName(username)
    }

    getEmail = ():string => {return this.currentUser.getEmail()};

    //for now typescript inference type checking will be acceptable, but later I will explicitly define the promise return type
    //once the dbHandler class is built
    setEmail = async (email:string) => {
        //we have declared this function async because later I will query the database to see if this email already
        //exists and await the response
        //we have some minor duplicate code here in validating email as a valid input may address later
        if (email.includes ("@") && email.includes (".")) 
            {
                this.currentUser.setEmail(email); 
            }
        else {
            throw new Error("user.ts: 90 email not in a valid format");
        }
    }

        //for now typescript inference type checking will be acceptable, but later I will explicitly define the promise return type
        //once the dbHandler class is built
    setPasswordHash = async (passwordHash:string) => {
         //we have declared this function async because later I will query the database to see if this password hash already
        //exists and await the response
        this.currentUser.setPasswordHash(passwordHash);
    }
    
    setUpdatedAt = () => {
        this.currentUser.setLastUpdate(new Date());
    }

    getCreatedAt = ():string => {return this.currentUser.getCreatedAt();}

    getUpdatedAt = ():string => {return this.currentUser.getLastUpdate();}


}
