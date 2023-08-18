const mongoose= require("mongoose");

const postSchema = new mongoose.Schema({
    userID: {
        type:String,
        required: true
    },
    content: {
        type: String,
        max: 250
    },
    img: {
        type: String,

    },
    likes:{
        type: Array,
        default: []
    }
},
{timestamps:true},
);


module.exports= mongoose.model("Post", postSchema);