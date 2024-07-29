export abstract class IUser {
  protected id: number;
  protected username: string;
  protected email: string;
  protected passwordHash: string;
  protected createdAt: Date;
  protected updatedAt: Date;

  constructor(
    id: number,
    username: string,
    email: string,
    passwordHash: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = "";
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export class User extends IUser {
  constructor(username: string, passwordHash: string, email: string) {
    const getRandomInt = (max: number) => {
      return Math.floor(Math.random() * max);
    };

    super(
      getRandomInt(10000),
      username,
      email,
      passwordHash,
      new Date(),
      new Date()
    );
/*
    if (username == null || passwordHash == null || email == null) {
      throw new Error(
        "User constructor failed. Some paramters are null or undefined."
      );
    } 
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (pattern.test(email))
    {
      
    
    }
    else {
      console.error("User contstructor failed. ");
    } */
  }

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

  setLastUpdate(Date: Date): void {
    try {
      this.updatedAt = Date;
    }
    catch{
      throw new Error("user.setLastUpdate() failed");
    }
  }

  setUserName(username: string): void {
    this.username = username;
  }

  setEmail(email: string): void {
    try{
      if (!email.includes("@") || !email.includes(".")){
        this.email = email;
      }
    }
    catch{
      throw new Error("user.setEmail() failed");
    }
    
  }

  setPasswordHash(passwordHash: string): void {
    this.passwordHash = passwordHash;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }
}

