import express from "express"
import dotenv from "dotenv"
import connectDB from "./Config/db.js";
dotenv.config();



const port = process.env.PORT;
const app = express();

app.listen(port,()=>
{
   console.log(`AUTH SERVER listening at port ${port}`);
     connectDB();
});

app.get("/", (req,res)=>
{
   res.send("AUTH SERVICE");
})