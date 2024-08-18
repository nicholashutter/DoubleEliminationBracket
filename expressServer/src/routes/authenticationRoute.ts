const express = require('express');

const router = express.Router();

router.get("/login", (req, res )=>
    {
        /* TODO
        should return whether session is valid or not
        based on userID
        done with req.params 
        */
    });

router.post("/login", (req, res) => 
{
    /* TODO
    logic to login new user if no valid session, 
    redirect to home page if valid session
    done with req.BODY
    */
});

router.delete("/api/logout", (req, res)=> 
{
    /* TODO
    logic to manually destroy session but not
    user properties in database 
    done with req.params
    */
});

module.exports = router;