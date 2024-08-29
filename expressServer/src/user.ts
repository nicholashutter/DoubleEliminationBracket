

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
  private eliminations: number;
  private inGame: boolean;
  private round: number;
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
    if (id)
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
    this.eliminations = 0;
    this.inGame = false;
    this.round = 0;
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

  set setUserID(userID: number)
  {
    if (this.id === undefined)
    {
      this.id = userID;
    } else
    {
      console.log("Unable to update UserID because one already exists. This should not be possible. Err 016");
    }
  }

  get getUserName(): string
  {
    return this.userName;
  }

  set setUserName(userName: string)
  {
    this.userName = userName;
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
        throw new Error("Email format incompatible. Please resubmit. Err 17");
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

  set setLastUpdate(lastUpdate: Date)
  {
    this.lastUpdate = lastUpdate;
  }

  set setEliminations(eliminations: number)
  {
    this.eliminations = eliminations;
  }

  get getEliminations()
  {
    return this.eliminations;
  }

  get getCreated(): Date
  {
    return this.created;
  }

  set setCreated(created: Date)
  {
    this.created = created;
  }

  get getCurrentRank(): number
  {
    return this.currentRank;
  }

  set setCurrentRank(currentRank: number)
  {
    this.currentRank = currentRank;
  }

  get getAllTimeWins(): number
  {
    return this.allTimeWins;
  }

  set setAllTimeWins(allTimeWins: number)
  {
    this.allTimeWins = allTimeWins;
  }

  get getAllTimeLosses(): number
  {
    return this.allTimeLosses;
  }

  set setAllTimeLosses(allTimeLosses: number)
  {
    this.allTimeLosses = allTimeLosses;
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

  get getRound()
  {
    return this.round;
  }
  set setRound(round: number)
  {
    this.round = round;
  }

  set setGamesPlayed(totalGamesPlayed: number)
  {
    this.totalGamesPlayed = totalGamesPlayed;
  }

  get getGamesPlayed()
  {
    return this.totalGamesPlayed;
  }

  set setDatesPlayed(datesPlayed: Array<Date>)
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
  ): number
  {
    const user = new User(username, passwordHash, email, id);
    this.Users.push(user);
    return user.getUserID;
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
    id?: number,
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
    const user = new User(username, passwordHash, email);

    if (id)
    {
      user.setUserID = id;
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
    if (lastUpdate)
    {
      user.setLastUpdate
    }
    if (created)
    {
      user.setCreated = created;
    }

  }

  public getUser<T>(value: T): User
  {
    let user = new User("-1", "-1", "-1");


    const getByUserName = (value: string) =>
    {
      try
      {
        const foundUser = this.Users.find(user => user.getUserName === value);

        if (foundUser === undefined)
        {
          throw new Error("User not found in Users collection. Err 013");
        }
        else
        {
          user = foundUser;
        }
      }

      catch (error) { console.log(error); }
    }

    const getByUserID = (value: number) =>
    {
      try
      {
        const foundUser = this.Users.find(user => user.getUserID === value);

        if (foundUser === undefined)
        {
          throw new Error("User not found in Users collection. Err 014");
        }

        else
        {
          user = foundUser;
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

    return user;
  }

  public deleteUser(userID: number)
  {
    try
    {
      const foundUser = this.Users.find(user => user.getUserID === userID);

      if (foundUser === undefined)
      {
        throw new Error("User not found in Users collection. Err 015");
      }

      else
      {
        this.Users.splice(this.Users.findIndex(User => User.getUserID === userID), 1);
      }
    }
    catch (error) { console.log(error); }
  }


}

