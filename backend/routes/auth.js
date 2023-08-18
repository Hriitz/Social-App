const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// router.get("/", (req, res)=>{
//     res.send("Auth Route")
// });

//REGISTER
router.post("/signup", async (req,res)=>{
    // const user = await new User({
    //     username: "Hritik",
    //     email: "hritik@test.com",
    //     password: "test1234"
    //     await user.save()
    //     res.send("okay")
    // }) 
    try{
        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // creating new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // save user and return response
        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
});

//LOGIN
router.post("/login", async (req, res)=>{
    try{
    const user= await User.findOne({email:req.body.email});
/**     
 *  [  !user && res.status(404).json("user not found");  ]
 * */
    if(!user){
        res.status(404).json("user not found");
    }

    const validPassword= await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        res.status(400).json("incorrect password");
    }

    res.status(200).json(user);

    }catch(err){
        res.status(500).json(err);
    } 
}); 

module.exports = router;