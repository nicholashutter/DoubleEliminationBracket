interface User {
    id?: number;
    userName?: string;
    email?: string;
    passwordHash?: string;
    authenticated?: boolean;
    seed?: number;
    inGame?: boolean;
    currentRank?: number;
}

export default User; 