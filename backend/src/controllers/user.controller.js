const userService = require('../services/user.service');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {prisma}=require('../config/db');
const {JWT_SECRET,JWT_EXPIRE}=require('../config/env');

exports.registerUser=async(req,res)=>{
  try{
    const {name,email,password}=req.body;
    const existingUser=await prisma.user.findUnique({where:{email}});
    if(existingUser) return res.status(400).json({message:"User already exists"});

    const hashedPassword=await bcrypt.hash(password,10);
    const user=await prisma.user.create({
      data:{name,email,password:hashedPassword}
    });

    res.status(201).json({message:"User registered successfully",user});
  }catch(err){
    console.error(err);
    res.status(500).json({message:"Server error"});
  }
};

exports.loginUser=async(req,res)=>{
  try{
    const {email,password}=req.body;
    const user=await prisma.user.findUnique({where:{email}});
    if(!user) return res.status(400).json({message:"Invalid credentials"});

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({message:"Invalid credentials"});

    const token=jwt.sign({id:user.id,role:user.role},JWT_SECRET,{expiresIn:JWT_EXPIRE});
    res.json({token,user});
  }catch(err){
    console.error(err);
    res.status(500).json({message:"Server error"});
  }
};

exports.getProfile=async(req,res)=>{
  try{
    const user=await prisma.user.findUnique({where:{id:req.user.id}});
    res.json(user);
  }catch(err){
    res.status(500).json({message:"Server error"});
  }
};

exports.updateProfile=async(req,res)=>{
  try{
    const data=req.body;
    const updated=await prisma.user.update({
      where:{id:req.user.id},
      data
    });
    res.json({message:"Profile updated",user:updated});
  }catch(err){
    res.status(500).json({message:"Server error"});
  }
};
