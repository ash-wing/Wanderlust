const express = require("express");
const router = express.Router();

//index - posts
router.get("/", (req, res)=>{
    res.send("GET for posts");
})

//show - users
router.get("/:id", (req, res)=>{
    res.send("GET fot post id")
})

//post route - users
router.post("/:id", (req, res)=>{
    res.send("POST for posts");
});

//Delete - users
router.delete("/:id", (req, res)=>{
    res.send("DELETE post")
})

module.exports = router