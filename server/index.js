import express from 'express';
import Connectdb from './DB/connect.js';
import Userrouter from './Routes/Userroute.js';
import cookieParser from 'cookie-parser';
 const app=express();
Connectdb()
app.use(express.json())
app.use(cookieParser());
app.use(Userrouter)
 app.listen(6000,()=>{
    console.log("server is running")
 })