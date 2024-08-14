class Bracket{
    isRunning: boolean;
    


    constructor(){
        this.isRunning = true; 

    }

}



export default class BracketManager{

    static #instance:BracketManager;
   
    private constructor (){
       

    }
    public static getInstance(): BracketManager{
        if (!BracketManager.#instance ){
            BracketManager.#instance = new BracketManager();
        }

        return BracketManager.#instance;
    }



}