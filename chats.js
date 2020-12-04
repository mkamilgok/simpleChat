const express = require("express");
const app = express();
const router = express.Router();

//Obtain necessary database tables
const User = require("./models/user.js");
const Message = require("./models/message.js");
const Blocked = require("./models/blocked.js");

router.use(checkAuthenticated);

//send new message to the given user
router.post("/send/:username",  async(req, res, next) => {
    try {
        let isBlocked = await Blocked.findOne({$and:[{blockedUsername: req.params.username},{byUsername: req.user.username}]})
                        || await Blocked.findOne({$and:[{blockedUsername: req.user.username},{byUsername: req.params.username}]});
        if(isBlocked){
            console.log(isBlocked);
            throw {message: "The user is blocked or you are blocked by the user"};
        }
        if(await User.findOne({username: req.params.username}) == null){
            throw {message: "There is no such a user."};
        }
        if(req.body.messageText.length < 1){
            throw {message: "The message cannot be empty text."};
        }
        else{
            const newMessage = new Message({
                senderUsername: req.user.username,
                receiverUsername: req.params.username,
                messageText: req.body.messageText
            });
            const sentMessage = await newMessage.save();
            res.send(sentMessage);
        }
    } catch (err) {
        res.status(404).send({message: err.message});
    }
})

//get chat messages between given user and in a specified start date
router.get("/:username/:daysAgo", async (req, res, next) => {
    try{
        let startDate = new Date();
        let daysAgo = parseInt(req.params.daysAgo);
        startDate.setDate(startDate.getDate() - daysAgo);
        const messages = await Message.find({$or: [
                {$and:[{senderUsername: req.user.username},{receiverUsername: req.params.username}, {messageDate: {$gt: startDate}}]},
                {$and:[{senderUsername: req.params.username},{receiverUsername: req.user.username}, {messageDate: {$gt: startDate}}]}
        ]});
        res.send(messages);
    } catch (err) {
        res.status(400).send({message: err.message});
    }
});

//block a user with a given username
router.post("/block/:username", async(req, res, next) => {
    try {
        if(await Blocked.findOne({blockedUsername: req.params.username, byUsername: req.user.username})
        || await User.findOne({username: req.params.username}) == null){
            throw {message: "Invalid Request, This user is already blocked or there is no such a user."};
        }
        const newBlocked = new Blocked({
            blockedUsername: req.params.username,
            byUsername: req.user.username
        });
        const addedBlocked = await newBlocked.save();
        res.send(addedBlocked);
    } catch (err) {
        res.status(400).send({message: err.message});
    }
});

//remove block of a given user
router.delete("/unblock/:username", async(req, res, next) => {
    try {
        const result = await Blocked.findOneAndDelete({$and:[{blockedUsername: req.params.username},{byUsername: req.user.username}]});
        if(result)
            res.status(204).send();
        else
            throw {message: "Not blocked"};
    } catch (err) {
        res.status(400).send({message: err.message});
    }
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send({message : "Unauthorized, login required."});
}

module.exports = router;