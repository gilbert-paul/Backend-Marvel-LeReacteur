const mongoose = require("mongoose")
const User = require("./User")

const Favorite = mongoose.model("Favorite",{
  title:String,
  description:String,
  image:String,
  type:String,
  id:String,
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:User
  }
})

module.exports = Favorite