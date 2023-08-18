const User= require("../models/User");
const router = require("express").Router();
const bcrypt= require("bcrypt")


// router.get("/", (req, res)=>{
//     res.send("UserRoute")
// });

//update user
router.put("/:id/update", async (req, res)=>{
    if(req.body.userID === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt); 
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.body.userID, {$set:req.body, });
            res.status(200).json("Account has been updated");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can update only your account");
    }
});

//delete user
router.delete("/:id/delete", async (req, res)=>{
    if(req.body.userID === req.params.id || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.body.userID);
            res.status(200).json("Account has been deleted");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can delete only your account");
    }
});

//get a user
router.get("/:id", async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password, updatedAt, createdAt, isAdmin,...other} = user._doc
        res.status(200).json(other);  
    }catch(err){
        res.status(500).json(err);
    }
});
//follow a user
router.put("/:id/follow", async(req, res)=>{
    if(req.body.userID !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currUser = await User.findById(req.body.userID);
            if(!user.followers.includes(req.body.userID)){
                await user.updateOne({$push:{followers:req.body.userID}});
                await currUser.updateOne({$push:{following:req.params.id}});
                res.status(200).json("Followed");
            }else{
                res.status(403).json("Already followed");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("invalid action(cannot follow yourself");     
    }
});
//unfollow a user
router.put("/:id/unfollow", async(req, res)=>{
    if(req.body.userID !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currUser = await User.findById(req.body.userID);
            if(user.followers.includes(req.body.userID)){
                await user.updateOne({$pull:{followers:req.body.userID}});
                await currUser.updateOne({$pull:{following:req.params.id}});
                res.status(200).json("Unfollowed");
            }else{
                res.status(403).json("you don't follow this user");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("invalid action(cannot unfollow yourself");     
    }
});

module.exports= router 