const userService = require('../services/user.service');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {prisma}=require('../config/db');
const {JWT_SECRET,JWT_EXPIRE}=require('../config/env');

exports.registerUser=async(req,res)=>{
  try{
    const {name,email,password,role}=req.body;
    
    // Validate role - USER, RECRUITER, or COMPANY allowed during signup (not ADMIN)
    const allowedRoles = ['USER', 'RECRUITER', 'COMPANY'];
    const userRole = role && allowedRoles.includes(role) ? role : 'USER';
    
    const existingUser=await prisma.user.findUnique({where:{email}});
    if(existingUser) return res.status(400).json({message:"User already exists"});

    const hashedPassword=await bcrypt.hash(password,10);
    const user=await prisma.user.create({
      data:{name,email,password:hashedPassword,role:userRole}
    });

    // Generate token immediately after registration
    const token=jwt.sign({id:user.id,role:user.role},JWT_SECRET,{expiresIn:JWT_EXPIRE});
    
    // Don't send password back
    const {password:_,...userWithoutPassword} = user;

    res.status(201).json({
      message:"User registered successfully",
      token,
      user:userWithoutPassword
    });
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

    // Check if user has a password (not OAuth-only account)
    if(!user.password) return res.status(400).json({message:"Please login with Google"});

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({message:"Invalid credentials"});

    const token=jwt.sign({id:user.id,role:user.role},JWT_SECRET,{expiresIn:JWT_EXPIRE});
    
    // Don't send password back
    const {password:_,...userWithoutPassword} = user;
    
    res.json({token,user:userWithoutPassword});
  }catch(err){
    console.error(err);
    res.status(500).json({message:"Server error"});
  }
};

exports.getProfile=async(req,res)=>{
  try{
    if(!req.user){
      return res.status(401).json({message:"Not authorized"});
    }
    const user=await prisma.user.findUnique({
      where:{id:req.user.id},
      include:{
        experience:{orderBy:{startDate:'desc'}},
        education:{orderBy:{startYear:'desc'}}
      }
    });
    const { password: _password, ...userWithoutPassword } = user || {};
    res.json(userWithoutPassword);
  }catch(err){
    res.status(500).json({message:"Server error"});
  }
};

exports.updateProfile=async(req,res)=>{
  try{
    const { experience, education, ...profileData } = req.body;
    
    // Update user profile
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: profileData,
    });

    // Handle work experience updates
    if (experience && Array.isArray(experience)) {
      const existingExp = await prisma.workExperience.findMany({
        where: { userId: req.user.id },
      });
      const existingIds = new Set(existingExp.map(e => e.id));
      const incomingIds = new Set(experience.filter(e => e.id).map(e => e.id));

      // Delete removed experiences
      for (const exp of existingExp) {
        if (!incomingIds.has(exp.id)) {
          await prisma.workExperience.delete({ where: { id: exp.id } });
        }
      }

      // Create or update experiences
      for (const exp of experience) {
        if (exp.id && existingIds.has(exp.id)) {
          await prisma.workExperience.update({
            where: { id: exp.id },
            data: {
              jobTitle: exp.jobTitle,
              company: exp.company,
              location: exp.location,
              employmentType: exp.employmentType,
              startDate: exp.startDate,
              endDate: exp.endDate,
              currentlyWorking: exp.currentlyWorking,
              description: exp.description,
              skillsUsed: exp.skillsUsed || [],
            },
          });
        } else {
          await prisma.workExperience.create({
            data: {
              jobTitle: exp.jobTitle,
              company: exp.company,
              location: exp.location,
              employmentType: exp.employmentType,
              startDate: exp.startDate,
              endDate: exp.endDate,
              currentlyWorking: exp.currentlyWorking,
              description: exp.description,
              skillsUsed: exp.skillsUsed || [],
              userId: req.user.id,
            },
          });
        }
      }
    }

    // Handle education updates
    if (education && Array.isArray(education)) {
      const existingEdu = await prisma.education.findMany({
        where: { userId: req.user.id },
      });
      const existingIds = new Set(existingEdu.map(e => e.id));
      const incomingIds = new Set(education.filter(e => e.id).map(e => e.id));

      // Delete removed education
      for (const edu of existingEdu) {
        if (!incomingIds.has(edu.id)) {
          await prisma.education.delete({ where: { id: edu.id } });
        }
      }

      // Create or update education
      for (const edu of education) {
        if (edu.id && existingIds.has(edu.id)) {
          await prisma.education.update({
            where: { id: edu.id },
            data: {
              degree: edu.degree,
              university: edu.university,
              fieldOfStudy: edu.fieldOfStudy,
              startYear: parseInt(edu.startYear),
              endYear: edu.endYear ? parseInt(edu.endYear) : null,
              isPresent: edu.isPresent,
              grade: edu.grade,
              description: edu.description,
            },
          });
        } else {
          await prisma.education.create({
            data: {
              degree: edu.degree,
              university: edu.university,
              fieldOfStudy: edu.fieldOfStudy,
              startYear: parseInt(edu.startYear),
              endYear: edu.endYear ? parseInt(edu.endYear) : null,
              isPresent: edu.isPresent,
              grade: edu.grade,
              description: edu.description,
              userId: req.user.id,
            },
          });
        }
      }
    }

    // Fetch updated user with all relations
    const finalUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        experience: {orderBy: { startDate: 'desc' }},
        education: {orderBy: { startYear: 'desc' }},
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: finalUser,
      success: true,
    });
  }catch(err){
    console.error('Profile update error:', err);
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
      success: false,
    });
  }
};

exports.getUserPublic = async (req, res) => {
  try{
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        experience: { orderBy: { startDate: 'desc' } },
        education: { orderBy: { startYear: 'desc' } },
      },
    });
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, email, phone, resume, resumeOriginalName, googleId, provider, ...publicUser } = user;
    res.json(publicUser);
  }catch(err){
    res.status(500).json({message:"Server error"});
  }
};
