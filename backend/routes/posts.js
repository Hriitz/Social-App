const router = require("express").Router();
const Post = require("../models/Post");
const { findById } = require("../models/User");

//create a post
router.post("/create", async(req,res)=> {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
    }catch(err){
        res.status(500).json(err)
    }
});
//update a post
router.put("/:id", async(req, res)=> {
    try{
     const post = await Post.findById(req.params.id);
     if(post.userID !== req.body.userID){
        await post.updateOne({$set:req.body});
        res.status(200).json("Post updated");
     }else{
        res.status(403).json("Invalid post for user");
     }
    }catch(err){
        res.status(500).json(err);
    } 
});
//delete a post
router.delete("/:id", async(req, res)=> {
    try{
     const post = await Post.findById(req.params.id);
     if(post.userID === req.body.userID){
        await post.deleteOne();
        res.status(200).json("Post deleted");
     }else{
        res.status(403).json("Invalid post for user");
     }
    }catch(err){
        res.status(500).json(err);
    } 
});
//like a post
router.put("/:id/like", async(req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userID)){
            await post.updateOne({$push:{likes:req.body.userID}});
            res.status(200).json("post liked");
        }else{
            await post.updateOne({$pull:{likes:req.body.userID}});
            res.status(200).json("post unliked");
        }

    } catch (err) {
        res.status(500).json(err);
    }
});
//get a post
//get timeline


module.exports= router;
