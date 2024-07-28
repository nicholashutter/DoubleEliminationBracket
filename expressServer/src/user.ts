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

    if (username == null || passwordHash == null || email == null) {
      throw new Error(
        "User constructor failed. Some paramters are null or undefined."
      );
    } else if (!email.includes("@") || !email.includes(".")) {
      throw new Error("User constructor failed. Email parameter invalid.");
    } else {
      super(
        getRandomInt(10000),
        username,
        email,
        passwordHash,
        new Date(),
        new Date()
      );
    }
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

