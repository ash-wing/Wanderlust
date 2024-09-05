const express = require("express");
const router = express.Router();


//index - users
router.get("/", (req, res)=>{
    res.send("GET for users");
})

//show - users
router.get("/:id", (req, res)=>{
    res.send("GET fot user id")
})

//post route - users
router.post("/:id", (req, res)=>{
    res.send("POST for users");
});

//Delete - users
router.delete("/:id", (req, res)=>{
    res.send("DELETE user")
})


module.exports = router;