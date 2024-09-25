interface User
{
    id?: number;
    userName?: string;
    email?: string;
    passwordHash?: string;
    created?: Date;
    lastUpdate?: Date;
    eliminations?: number;
    inGame?: boolean;
    round?: number;
    currentRank?: number;
    allTimeWins?: number;
    allTimeLosses?: number;
    totalGamesPlayed?: number;
    datesPlayed?: Array<Date>;
}

export default User;






