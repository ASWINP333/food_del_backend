import mongoose from "mongoose"

export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://aswinp:projects63603@cluster0.cg3kxnl.mongodb.net/food-del').then(()=>console.log("DB CONNECTED"));
}