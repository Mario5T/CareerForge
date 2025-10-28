const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const { JWT_SECRET } = require('../config/env');
const { AppError } = require('../utils/errorHandler');


exports.protect=async(req,res,next)=>{
  const authHeader=req.headers.authorization;
  if(!authHeader||!authHeader.startsWith('Bearer '))
    return res.status(401).json({message:"Not authorized, no token"});

  const token=authHeader.split(' ')[1];
  try{
    const decoded=jwt.verify(token,JWT_SECRET);
    req.user=await prisma.user.findUnique({where:{id:decoded.id}});
    next();
  }catch(err){
    res.status(401).json({message:"Token failed"});
  }
};