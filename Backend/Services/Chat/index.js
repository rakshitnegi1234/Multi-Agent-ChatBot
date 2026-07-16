import express from "express"
import dotenv from "dotenv"
import connectDB from "./Config/db.js";
import router from "./Routes/chat.routes.js";


dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(express.json()); 

app.use("/", router);

app.listen(port,()=>
{
   console.log(`CHAT SERVER listening at port ${port}`);
     connectDB();
});

app.get("/", (req,res)=>
{
   res.send("CHAT SERVICE");
})