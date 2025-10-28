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
const {registerUser,loginUser,getProfile,updateProfile}=require('../controllers/user.controller');
const {protect}=require('../middlewares/auth.middleware');

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/profile',protect,getProfile);
router.put('/profile',protect,updateProfile);

module.exports=router;
