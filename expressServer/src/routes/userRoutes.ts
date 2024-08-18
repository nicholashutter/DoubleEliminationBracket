const express = require('express');

const router = express.Router();

router.get("/api/getUser", (req, res )=>
    {
        /* TODO
        logic to return selected user,
        done with req.params
        */
    });

router.post("/api/createUser", (req, res) => 
{
    /* TODO
    logic to create new user and upload to 
    database if not exists,  done with json request.BODY
    */
});

router.put("/api/updateUser", (req, res) =>
{
    /* TODO
    logic to get selected user, copy all properties, 
    create new user with updated properties, 
    copy all non updated properties, 
    delete original user, upload replacement user to 
    database, done with json request.BODY
    */
});

router.delete("/api/leaveBracket", (req, res)=> 
{
    /* TODO
    logic to get selected user, delete them, 
    delete from datatbase
    done with req.params
    */
});

module.exports = router;