// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/user.controller');
// const { protect, authorize } = require('../middlewares/auth.middleware');

// // Public routes
// router.post('/register', userController.register);
// router.post('/login', userController.login);

// // Protected routes
// router.use(protect);

// router.get('/profile', userController.getProfile);
// router.put('/profile', userController.updateProfile);

// // Admin only
// router.delete('/:id', authorize('ADMIN'), userController.deleteUser);

// module.exports = router;


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

// Public user profile by ID (must be after '/profile' to avoid conflicts)
router.get('/:id', getUserPublic);

module.exports=router;
