export default class UserManager {
  static #instance: UserManager;
  private Users: Array<User>; 

  private constructor(
    
  ) {
    this.Users = []; 
  }

  public static getInstance(): UserManager {
    if (!UserManager.#instance) {
      UserManager.#instance = new UserManager();
    }
    return UserManager.#instance;
  }

  public createUser(
    username: string,
    passwordHash: string,
    email: string,
    id?: number
  ) {
    const user = new User(username,passwordHash,email,id);
    this.Users.push(user);
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
    totalGamesPlayed?:number
  ){
    const user = new User(username,passwordHash, email);
    user.setCreated();
    if (id){
      user.setUserID(id);
    }
    if (authenticated){
      user.setAuthenticated(authenticated);
    }
    if (inGame){
      user.setInGame(inGame);
    }
    if (currentRank){
      user.setCurrentRank(currentRank);
    }
    if (allTimeWins){
      user.setAllTimeWins(allTimeWins);
    }
    if (allTimeLosses){
      user.setAllTimeLosses(allTimeLosses);
    }
    if (totalGamesPlayed){
      user.updateDatesPlayed(totalGamesPlayed); 
    }

  }

  public getUser(userID: number): User{
    let user = new User("-1", "-1", "-1"); 
    try {
        const foundUser = this.Users.find (user => user.getUserID === userID);
        if (foundUser === undefined) {
          throw new Error("user.ts line 33: User not found in Users collection");
        }
        else {
          user = foundUser; 
        }
    }
    catch (error) {console.log(error);}
    return user; 
  }

  public deleteUser(userID: number) {
    try {
      const foundUser = this.Users.find (user => user.getUserID === userID);
      if (foundUser === undefined) {
        throw new Error("user.ts line 33: User not found in Users collection");
      }
      else {
        this.Users.splice(this.Users.findIndex(User => User.getUserID === userID), 1);
      }  
  }
  catch (error) {console.log(error);}
  }

  
}
/*
Class user holds common user properties 
*/
class User {
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
  private inGame: boolean;
  private currentRank: number;
  private allTimeWins: number;
  private allTimeLosses: number;
  private totalGamesPlayed: number;
  // TODO datesPlayed should take new Date everytime and final score should be kept here before loaded into database
  private datesPlayed: Map<Date, number>;

  constructor(
    username: string,
    passwordHash: string,
    email: string,
    id?: number
  ) {
    if (!id) {
      this.id = Math.floor(Math.random() * 1000);
    } else {
      this.id = id;
    }
    this.userName = username;
    this.passwordHash = passwordHash;
    this.email = email;
    this.created = new Date();
    this.lastUpdate = new Date();
    this.authenticated = false;
    this.inGame = false;
    this.currentRank = -1; //value -1 indicates default
    this.allTimeWins = -1;
    this.allTimeLosses = -1;
    this.datesPlayed = new Map<Date, number>();
    this.totalGamesPlayed = 0 
  }
  /*
Functions Getters and Setters with some basic input validation
*/
  get getUserID(): number {
    return this.id!;
  }

  setUserID(value: number) {
    if (this.id === undefined) {
      this.id = value;
    } else {
      console.log("Cannot update userID. UserID already exists");
    }
  }

  get getUserName(): string {
    return this.userName;
  }

  setUserName(value: string) {
    this.userName = value;
  }

  get getEmail(): string {
    return this.email;
  }

  setEmail(email: string) {
    try {
      if (!email.includes("@") || !email.includes(".")) {
        this.email = email;
      } else {
        throw new Error("user.ts line 82: Incorrectly formatted email");
      }
    } catch (e) {
      console.log(e);
    }
  }

  get getLastUpdate(): Date {
    return this.lastUpdate;
  }

  setLastUpdate() {
    this.lastUpdate = new Date();
  }

  get getCreated(): Date {
    return this.created;
  }

  setCreated() {
    this.created = new Date();
  }

  get getAuthenticated(): boolean {
    return this.authenticated;
  }

  setAuthenticated(authenticated?: boolean) {
    if (authenticated) {
      this.authenticated = authenticated;
    }
    else{
      this.authenticated = this.authenticated ? true : false;
    }
  }

  get getCurrentRank(): number {
    return this.currentRank;
  }

  setCurrentRank(value: number) {
    this.currentRank = value;
  }

  get getAllTimeWins(): number {
    return this.allTimeWins;
  }

  setAllTimeWins(value: number) {
    this.allTimeWins = value;
  }

  get getAllTimeLosses(): number {
    return this.allTimeLosses;
  }

  setAllTimeLosses(value: number) {
    this.allTimeLosses = value;
  }

  get getPasswordHash(): string {
    return this.passwordHash;
  }

  get getInGame():boolean {
    return this.inGame;
  }

  setInGame(inGame?:boolean) {
    if (inGame) {
      this.inGame = inGame;
    }
    else{
      this.inGame = this.inGame ? true : false;
    }
    
  }

  updateDatesPlayed(totalGamesPlayed?:number){
    if (totalGamesPlayed){
      this.totalGamesPlayed = totalGamesPlayed;
    }
    else {
      this.totalGamesPlayed ++; 
    }
    this.datesPlayed.set(new Date(), this.totalGamesPlayed);
  }


}
