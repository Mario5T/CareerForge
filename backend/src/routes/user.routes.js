






const express=require('express');
const router=express.Router();
const {registerUser,loginUser,getProfile,updateProfile,getUserPublic,uploadResume,deleteResume,saveJob,unsaveJob,getSavedJobs}=require('../controllers/user.controller');
const {protect}=require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/profile',protect,getProfile);
router.put('/profile',protect,updateProfile);
router.put('/resume', protect, upload.single('resume'), uploadResume);
router.delete('/resume', protect, deleteResume);

router.post('/saved-jobs/:jobId', protect, saveJob);
router.delete('/saved-jobs/:jobId', protect, unsaveJob);
router.get('/saved-jobs', protect, getSavedJobs);

router.get('/:id', getUserPublic);

module.exports=router;
