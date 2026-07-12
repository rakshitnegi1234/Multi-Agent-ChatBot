import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy";
dotenv.config();

// GATEWAY  pkg express-http-proxy

const port = process.env.PORT;
const app = express();

app.use("/auth", proxy(process.env.AUTH_SERVICE));

app.listen(port,()=>
{
   console.log(`GATEWAY SERVER listening at port ${port}`);
});

app.get("/", (req,res)=>
{
   res.send("GATEWAY SERVER");
})