import express from "express"
import dotenv from "dotenv"
import connectDB from "./Config/db.js";
dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(express.json()); 



app.listen(port,()=>
{
   console.log(`AGENT SERVER listening at port ${port}`);
     connectDB();
});

app.get("/", (req,res)=>
{
   res.send("AGENT SERVICE");
})