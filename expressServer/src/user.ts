
/*
Class user holds common user properties 
*/
export class User
{
  /*
Function Constructor initialize class members and generate id if none provided
*/
  private id: number;
  private userName: string;
  private email: string;
  private passwordHash: string;
  private created: Date;
  private lastUpdate: Date;
  private eliminations: number;
  private inGame: boolean;
  private round: number;
  private currentRank: number;
  private allTimeWins: number;
  private allTimeLosses: number;
  private totalGamesPlayed: number;
  private datesPlayed: Array<Date>;

  public constructor()
  {
    //-1 value anywhere in this application is a default value
    this.id = -1;
    this.userName = "";
    this.passwordHash = "";
    this.email = "";
    this.created = new Date();
    this.lastUpdate = new Date();
    this.eliminations = -1;
    this.inGame = false;
    this.round = -1;
    this.currentRank = -1; 
    this.allTimeWins = -1;
    this.allTimeLosses = -1;
    this.datesPlayed = [];
    this.totalGamesPlayed = -1
  }
  public init(username: string,
    passwordHash: string,
    email: string,
    id?: number)
  {
    this.userName = username;
    this.passwordHash = passwordHash;
    this.email = email;

    if (id)
    {
      this.id = id;
    }
  }
  /*
Functions Getters and Setters with some basic input validation
*/
  public get getUserID(): number
  {
    return this.id!;
  }

  public set setUserID(userID: number)
  {
    if (this.id === undefined)
    {
      this.id = userID;
    } else
    {
      console.log("Unable to update UserID because one already exists. This should not be possible. Err 016");
    }
  }

  public get getUserName(): string
  {
    return this.userName;
  }

  public set setUserName(userName: string)
  {
    this.userName = userName;
  }

  public get getEmail(): string
  {
    return this.email;
  }

  public set setEmail(email: string)
  {
    try
    {
      if (!email.includes("@") || !email.includes("."))
      {
        this.email = email;
      } else
      {
        throw new Error("Email format incompatible. Please resubmit. Err 017");
      }
    } catch (e)
    {
      console.log(e);
    }
  }

  public get getLastUpdate(): Date
  {
    return this.lastUpdate;
  }

  public set setLastUpdate(lastUpdate: Date)
  {
    this.lastUpdate = lastUpdate;
  }

  public set setEliminations(eliminations: number)
  {
    this.eliminations = eliminations;
  }

  public get getEliminations()
  {
    return this.eliminations;
  }

  public get getCreated(): Date
  {
    return this.created;
  }

  public set setCreated(created: Date)
  {
    this.created = created;
  }

  public get getCurrentRank(): number
  {
    return this.currentRank;
  }

  public set setCurrentRank(currentRank: number)
  {
    this.currentRank = currentRank;
  }

  public get getAllTimeWins(): number
  {
    return this.allTimeWins;
  }

  public set setAllTimeWins(allTimeWins: number)
  {
    this.allTimeWins = allTimeWins;
  }

  public get getAllTimeLosses(): number
  {
    return this.allTimeLosses;
  }

  public set setAllTimeLosses(allTimeLosses: number)
  {
    this.allTimeLosses = allTimeLosses;
  }

  public get getPasswordHash(): string
  {
    return this.passwordHash;
  }

  public get getInGame(): boolean
  {
    return this.inGame;
  }

  public set setInGame(inGame: boolean)
  {
    this.inGame = inGame;
  }

  public get getRound()
  {
    return this.round;
  }
  public set setRound(round: number)
  {
    this.round = round;
  }

  public set setGamesPlayed(totalGamesPlayed: number)
  {
    this.totalGamesPlayed = totalGamesPlayed;
  }

  public get getGamesPlayed()
  {
    return this.totalGamesPlayed;
  }

  public set setDatesPlayed(datesPlayed: Array<Date>)
  {
    this.datesPlayed = datesPlayed;
  }

  public get getDatesPlayed()
  {
    return this.datesPlayed;
  }

}


export default class UserManager 
{
  static #instance: UserManager;
  private Users: Array<User>;

  private constructor(

  )
  {
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
  )
  {
    const localUser = new User(); 
    localUser.init(username, passwordHash, email, id);
    this.Users.push(localUser);

    return localUser.getUserID;

  }

  public updateUser(currentUser: User)
  {
    try
    {
      const foundUser = this.Users.find((user) => user.getUserID == currentUser.getUserID);

      const userLocation = this.Users.indexOf(currentUser);

      if (foundUser!.getUserName == "-1" || foundUser === undefined)
      {
        throw new Error("Unable to find specified User. Err 009");
      }

      else 
      {
        delete this.Users[userLocation];

        this.Users[userLocation] = currentUser;

        console.log("User Updated Successfully");
      }

    }

    catch (e)
    {
      console.log(e);
    }

  }

  public replaceUser(username: string,
    passwordHash: string,
    email: string,
    id: number,
    inGame?: boolean,
    currentRank?: number,
    allTimeWins?: number,
    allTimeLosses?: number,
    totalGamesPlayed?: number,
    datesPlayed?: Array<Date>,
    lastUpdate?: Date,
    created?: Date,

  )
  {
    const localUser = new User();
    localUser.init(username, passwordHash, email, id); 

    if (id)
    {
      localUser.setUserID = id;
    }
    if (inGame)
    {
      localUser.setInGame = inGame;
    }
    if (currentRank)
    {
      localUser.setCurrentRank = currentRank;
    }
    if (allTimeWins)
    {
      localUser.setAllTimeWins = allTimeWins;
    }
    if (allTimeLosses)
    {
      localUser.setAllTimeLosses = allTimeLosses;
    }
    if (totalGamesPlayed)
    {
      localUser.setGamesPlayed = totalGamesPlayed;
    }
    if (datesPlayed)
    {
      localUser.setDatesPlayed = datesPlayed;
    }
    if (lastUpdate)
    {
      localUser.setLastUpdate
    }
    if (created)
    {
      localUser.setCreated = created;
    }

  }

  public getUser<T>(value: T): User
  {
    let localUser = new User();


    const getByUserName = (value: string) =>
    {
      try
      {
        const foundUser = this.Users.find(localUser => localUser.getUserName === value);

        if (foundUser === undefined)
        {
          throw new Error("User not found in Users collection. Err 013");
        }
        else
        {
          localUser = foundUser;
        }
      }

      catch (error) { console.log(error); }
    }

    const getByUserID = (value: number) =>
    {
      try
      {
        const foundUser = this.Users.find(localUser => localUser.getUserID === value);

        if (foundUser === undefined)
        {
          throw new Error("User not found in Users collection. Err 014");
        }

        else
        {
          localUser = foundUser;
        }
      }

      catch (error) { console.log(error); }
    }

    if (typeof value === "string")
    {
      getByUserName(value);
    }
    else if (typeof value === "number")
    {
      getByUserID(value);
    }

    return localUser;
  }

  public deleteUser(userID: number)
  {
    try
    {
      const foundUser = this.Users.find(localUser => localUser.getUserID === userID);

      if (foundUser === undefined)
      {
        throw new Error("User not found in Users collection. Err 015");
      }

      else
      {
        this.Users.splice(this.Users.findIndex(localUser => localUser.getUserID === userID), 1);
      }
    }
    catch (error) { console.log(error); }
  }


}

