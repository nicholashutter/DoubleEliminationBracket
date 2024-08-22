import { get } from "http";

/*
Class user holds common user properties 
*/
export class User
{
  /*
Function Constructor initialize class members and generate id if none provided
*/
  private id?: number;
  private userName: string;
  private email: string;
  private passwordHash: string;
  private created: Date;
  private lastUpdate: Date;
  private authenticated: boolean;
  private seed: number; 
  private inGame: boolean;
  private currentRank: number;
  private allTimeWins: number;
  private allTimeLosses: number;
  private totalGamesPlayed: number;
  private datesPlayed: Array<Date>;

  protected constructor(
    username?: string,
    passwordHash?: string,
    email?: string,
    id?: number
  )
  {
    if (!id)
    {
      this.id = Math.floor(Math.random() * 1000);
    } else
    {
      this.id = id;
    }
    this.userName = username!;
    this.passwordHash = passwordHash!;
    this.email = email!;
    this.created = new Date();
    this.lastUpdate = new Date();
    this.authenticated = false;
    this.seed = -1; 
    this.inGame = false;
    this.currentRank = -1; //value -1 indicates default
    this.allTimeWins = -1;
    this.allTimeLosses = -1;
    this.datesPlayed = [];
    this.totalGamesPlayed = -1 
  }
  /*
Functions Getters and Setters with some basic input validation
*/
  get getUserID(): number
  {
    return this.id!;
  }

  set setUserID(value: number)
  {
    if (this.id === undefined)
    {
      this.id = value;
    } else
    {
      console.log("Cannot update userID. UserID already exists");
    }
  }

  get getUserName(): string
  {
    return this.userName;
  }

  set setUserName(value: string)
  {
    this.userName = value;
  }

  get getEmail(): string
  {
    return this.email;
  }

  set setEmail(email: string)
  {
    try
    {
      if (!email.includes("@") || !email.includes("."))
      {
        this.email = email;
      } else
      {
        throw new Error("user.ts line 82: Incorrectly formatted email");
      }
    } catch (e)
    {
      console.log(e);
    }
  }

  get getLastUpdate(): Date
  {
    return this.lastUpdate;
  }

  set setLastUpdate(value:Date)
  {
    this.lastUpdate = value;
  }

  updateLastUpdate()
  {
    this.lastUpdate = new Date();
  }

  get getCreated(): Date
  {
    return this.created;
  }

  set setCreated(value:Date)
  {
    this.created = value;
  }

  updateCreated()
  {
    this.created = new Date();
  }

  get getAuthenticated(): boolean
  {
    return this.authenticated;
  }

  set setAuthenticated(authenticated: boolean)
  {
    this.authenticated = authenticated;
  }

  updateAuthenticated()
  {
    this.authenticated = this.authenticated ? true : false;
  }

  get getSeed(): number
  {
    return this.seed;
  }

  set setSeed(seed: number)
  {
    this.seed = seed; 
  }

  get getCurrentRank(): number
  {
    return this.currentRank;
  }

  set setCurrentRank(value: number)
  {
    this.currentRank = value;
  }

  incrementCurrentRank()
  {
    this.currentRank++; 
  }

  decrementCurrentRank()
  {
    this.currentRank--;
  }

  get getAllTimeWins(): number
  {
    return this.allTimeWins;
  }

  set setAllTimeWins(value: number)
  {
    this.allTimeWins = value;
  }

  updateAllTimeWins()
  {
    this.allTimeWins++; 
  }

  get getAllTimeLosses(): number
  {
    return this.allTimeLosses;
  }

  set setAllTimeLosses(value: number)
  {
    this.allTimeLosses = value;
  }

  updateAllTimeLosses()
  {
    this.allTimeLosses++;
  }

  get getPasswordHash(): string
  {
    return this.passwordHash;
  }

  get getInGame(): boolean
  {
    return this.inGame;
  }

  set setInGame(inGame: boolean)
  {
    this.inGame = inGame;
  }

  updateInGame()
  {
    this.inGame = this.inGame ? true : false;
  }
  updateDatesPlayed()
  {
    this.totalGamesPlayed++;
    this.datesPlayed.push(new Date());
  }

  set setGamesPlayed(totalGamesPlayed: number)
  {
    this.totalGamesPlayed = totalGamesPlayed;
  }

  get getGamesPlayed()
  {
    return this.totalGamesPlayed;
  }

  set setDatesPlayed(datesPlayed:Array<Date>)
  {
    this.datesPlayed = datesPlayed;
  }

  get getDatesPlayed()
  {
    return this.datesPlayed;
  }

}


export default class UserManager extends User
{
  static #instance: UserManager;
  private Users: Array<User>;

  private constructor(
    
  )
  {
    super(); //empty parent object garbage collector should delete
    this.Users = [];
  }

  public static get getInstance(): UserManager
  {
    if (!UserManager.#instance)
    {
      UserManager.#instance = new UserManager();
    }
    return UserManager.#instance;
  }

  public createUser(
    username: string,
    passwordHash: string,
    email: string,
    id?: number
  ):number
  {
    const user = new User(username, passwordHash, email, id);
    this.Users.push(user);
    return user.getUserID;
  }

  public updateUser(username: string,
    passwordHash: string,
    email: string,
    id?: number,
    authenticated?: boolean,
    inGame?: boolean,
    currentRank?: number,
    allTimeWins?: number,
    allTimeLosses?: number,
    totalGamesPlayed?: number,
    datesPlayed?: Array<Date>,
    seed?: number, 
    lastUpdate?: Date, 
    created?: Date, 

  )
  {
    const user = new User(username, passwordHash, email);
  
    if (id)
    {
      user.setUserID = id;
    }
    if (authenticated)
    {
      user.setAuthenticated = authenticated;
    }
    if (inGame)
    {
      user.setInGame = inGame;
    }
    if (currentRank)
    {
      user.setCurrentRank = currentRank;
    }
    if (allTimeWins)
    {
      user.setAllTimeWins = allTimeWins;
    }
    if (allTimeLosses)
    {
      user.setAllTimeLosses = allTimeLosses;
    }
    if (totalGamesPlayed)
    {
      user.setGamesPlayed = totalGamesPlayed;
    }
    if (datesPlayed)
    {
      user.setDatesPlayed = datesPlayed;
    }
    if (seed)
    {
      user.setSeed = seed;
    }
    if (lastUpdate)
    {
      user.setLastUpdate
    }
    if (created)
    {
      user.setCreated = created;
    }

  }

  public getUser<T>(value:T): User
  {
    let user = new User("-1", "-1", "-1");

    
    const getByUserName = (value:string) =>
    {
      try
      {
        const foundUser = this.Users.find(user => user.getUserName === value);
        if (foundUser === undefined)
        {
          throw new Error("user.ts line 33: User not found in Users collection");
        }
        else
        {
          user = foundUser;
        }
      }
      catch (error) { console.log(error); }
    }

    const getByUserID = (value:number) =>
    {
      try
      {
        const foundUser = this.Users.find(user => user.getUserID === value);
        if (foundUser === undefined)
        {
          throw new Error("user.ts line 33: User not found in Users collection");
        }
        else
        {
          user = foundUser;
        }
      }
      catch (error) { console.log(error); }
    }

    if (typeof value === "string" )
      {
        getByUserName(value);
      }
    else if (typeof value === "number")
      {
        getByUserID(value);
      }  
    
    return user;
  }

  public deleteUser(userID: number)
  {
    try
    {
      const foundUser = this.Users.find(user => user.getUserID === userID);
      if (foundUser === undefined)
      {
        throw new Error("user.ts line 33: User not found in Users collection");
      }
      else
      {
        this.Users.splice(this.Users.findIndex(User => User.getUserID === userID), 1);
      }
    }
    catch (error) { console.log(error); }
  }


}

