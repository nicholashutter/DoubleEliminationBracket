import mariadb from "mariadb";
import UserManager from "./user";

async function updateUser(userID: number)
{

  const userManager = UserManager.getInstance;

  const foundUser = await userManager.getUser(userID);

  const selectDb = "use userdb";

  const query =
    `INSERT INTO users (id, username, email, passwordHash, created, lastUpdate, inGame, 
      currentRank, allTimeWins, allTimeLosses, totalGamesPlayed) 
      VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?);`;

  /* 
    Control flow to convert boolean value to number that 
    Database can interpret
  */
  let foundInGame: number | boolean = foundUser.getInGame;

  if (foundInGame) 
  {
    foundInGame = 1;
  }

  else 
  {
    foundInGame = 0;
  }

  const params = [
    foundUser.getUserID as number,
    foundUser.getUserName as string,
    foundUser.getEmail as string,
    foundUser.getPasswordHash as string,
    foundUser.getCreated as Date,
    foundUser.getLastUpdate as Date,
    foundInGame as number,
    foundUser.getCurrentRank as number,
    foundUser.getAllTimeWins as number,
    foundUser.getAllTimeLosses as number,
    foundUser.getGamesPlayed as number
    /*
    --> Either restructure database to add another table, or use JSON data type in mariaDB
        to get all games played by date 
    */
  ];


  await doQuery(selectDb, query, params);

}

async function readUser(userID: number)
{

  const userManager = UserManager.getInstance;

  const foundUser = await userManager.getUser(userID);

  const selectDb = "use userdb";

  const query =
    `SELECT FROM users WHERE id = ?`;


  const params =
    [
      foundUser.getUserID as number
    ];

  return await doQuery(selectDb, query, params);
}


async function deleteUser(userID: number)
{
  const userManager = UserManager.getInstance;

  const foundUser = await userManager.getUser(userID);

  const selectDb = "use userdb";

  const query =
    "DELETE FROM users WHERE id = ?";

  const params =
    [
      foundUser.getUserID as number
    ];

  return await doQuery(selectDb, query, params);
}


const pool: mariadb.Pool =
  mariadb.createPool({
    host: "localhost",
    user: "root",
    connectionLimit: 50,
  });

async function doQuery(selectDb: string, query: string, params: any[])
{
  let conn: any = null;

  try
  {
    conn = await pool.getConnection();

    let res: any = conn.query(selectDb);

    res = await conn.query(query, params);

    if (res.length > 0)
    {
      return res[0];
    }

  }

  catch (e)
  {
    console.log(e);
  }

  finally
  {
    if (conn) conn.release();
  }
}

export { updateUser, readUser, deleteUser, doQuery }

