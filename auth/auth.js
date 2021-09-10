const  jwt=require('jsonwebtoken')
module.exports = function (req,res,next){
    const token=req.header('Token');
    if(!token)
        return res.status(401).send('Access denied,no token available');
    try {
    const obj=jwt.verify(token,'Store_key_generator');
    req.user=obj;
    next();
    }
    catch (err){
        res.status(400).send("400 ....invalid token");
    }
}