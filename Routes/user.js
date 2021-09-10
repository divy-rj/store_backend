
const mongoose = require('mongoose');
const express = require('express');
const joi = require("joi");
const rout = express.Router();
const jwt=require('jsonwebtoken');
const {User,validateuser,hash}=require('../model/user');
const auth=require('../auth/auth');
async function Resisteruser(user){

    console.log("registering");
    try {
        console.log("user = "+user+"bj");
        const u=await user.save();
        console.log("loh + "+u._id);
        return u;
    }
    catch (err){
        console.log(err.message+"saving error");

    }
}

async function user_autentication(email,password){

    try {
        const user=await User.findOne({email:email,password:password});
        if(user)
        {
            return user;
        }
        else
        {
            return new Error().message("Authentication failed");
        }
    }
    catch (err){
        console.log(err.message+"error");

    }
}

rout.post('/authentication',(req,res)=>{
    hash(req.body.password).then(password=>{
        user_autentication(req.body.email,password).then(user=>{
            const token=   jwt.sign({_id:user._id,admin:user.admin},'Store_key_generator');
            res.status(200).send(token);
            console.log(user)
        }).catch(err=>{
            res.status(400).send(err.message+"400");
            console.log(err.message+"400")
        }).catch(err=>{
            res.status(200).send(err.message+"200");
            console.log(err.message+"200")
        })
    })
})

rout.post('/register',(req,res)=>{
    const us={
        email:req.body.email,
        name:req.body.name,
        password:req.body.password,
        admin:req.body.admin,
    };
    console.log("us = "+req.body.admin+"hhh");
    const vr=validateuser(us);
    if (!vr.error)
    {
        hash(req.body.password).then(has=>{
            const user=new User({
                email:req.body.email,
                name:req.body.name,
                admin:req.body.admin,
                password:has
            })
            Resisteruser(user).then(ussr=>{
                const token=   jwt.sign({_id:ussr._id,admin:ussr.admin},'Store_key_generator');//temporary use...will be env
                res.status(200).send(token);
                console.log("user saved hello");
            }).catch((err)=>{
                res.status(400).send(err.message);

            })
        }).catch((err)=>{
            console.log('Hashing failed');
            res.status(400).send("Server Error ( "+err.message+" )");
        })


    }
    else{
        res.status(400).send(vr.error );
    }
})
async function  change_passcode(new_password,id){
    try{
        let user=await User.findByIdAndUpdate(id,{
            $set:{
                password:new_password,
            }
        },{
            new:true
        });
        if(user){

            return user;
        }
        else
        {
            return new Error().message("Authentication failed");
        }
    }
    catch (err){
        console.log(err.message);

    }
}

rout.post('/change_password',auth,(req , res)=>{
change_passcode(req.body.password,req.body.user._id).then(user=>{
    const token=   jwt.sign({_id:user._id,admin:user.admin},'Store_key_generator');
    res.status(200).send(token);
}).catch(err=>{
    res.send(err.message).status(404);
})
})

module.exports=rout;