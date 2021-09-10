
const mongoose=require('mongoose');
const express=require('express');
const products = require('../Routes/product');
const user_function=require('../Routes/user');
const jwt=require('jsonwebtoken');
const auth=require("../auth/auth")
const {User,validateuser,hash}=require('../model/user');
var app=express();
app.use(express.json());
app.use('/store/product', products)
app.use('/user',user_function);
const uri = "mongodb://localhost/store";

mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log("connected to db");
    })
    .catch(()=>{
        console.log("not connected");
    });

const port=3000;
app.listen(port,()=>{
    console.log(`listening at ${port}`);
})

