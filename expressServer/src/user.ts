/*
Class IUser

Purpose: 

All child classes that they must have those class members and define as protected 
*/
export abstract class IUser {
  protected id: number;
  protected username: string;
  protected email: string;
  protected password_hash: string;
  protected createdAt: Date;
  protected updatedAt: Date;
/*
Function IUser.Constructor()

Purpose: 

Set initial state of child classes when instanciated calling Super() in their constructors
All parameters have their values assigned to their respective class members
*/
  constructor(
    id: number,
    username: string,
    email: string,
    password_hash: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
/*
Class User

Purpose: 

Set initial state of child classes when instanciated calling Super() in their constructors
All parameters have their values assigned to their respective class members
*/
export class User extends IUser {
/*
Function Constructor

Purpose: 

Call Super() and intialize all class members
If id passed in, use passed in value otherwise call getRandomInt and create new id 
*/
  constructor(
    username: string,
    password_hash: string,
    email: string,
    id?: number
  ) {
    const getRandomInt = (max: number) => {
      return Math.floor(Math.random() * max);
    };

    if (id === undefined) {
      super(
        getRandomInt(10000),
        username,
        email,
        password_hash,
        new Date(),
        new Date()
      );
    } else {
      super(id, username, email, password_hash, new Date(), new Date());
    }
  }
/*
Functions Getters and Setters

Purpose: 

Standard implementation of encapsulating class members. getClassMemeber will return the value of ClassMember. 
setClassMember will take a corresponding parameter and set the class member to that value
Some setters have basic input validation with try catch
*/
  getUserID(): number {
    return this.id;
  }

  getUserName(): string {
    return this.username;
  }

  getEmail(): string {
    return this.email;
  }

  getLastUpdate(): Date {
    return this.updatedAt;
  }

  getCreatedAt(): Date {
    return this.updatedAt;
  }

  setCreatedAt(newCreatedAt: Date) {
    this.updatedAt = newCreatedAt;
  }

  setLastUpdate(Date: Date): void {
    try {
      this.updatedAt = Date;
    } catch {
      console.log("user.setLastUpdate() failed");
    }
  }

  setUserName(username: string): void {
    this.username = username;
  }

  setEmail(email: string): void {
    try {
      if (!email.includes("@") || !email.includes(".")) {
        this.email = email;
      }
    } catch {
      console.log("user.setEmail() failed");
    }
  }

  setPassword_Hash(password_hash: string): void {
    this.password_hash = password_hash;
  }

  getPassword_Hash(): string {
    return this.password_hash;
  }
}
