import express from "express";
const router = express.Router();

import { 
  getUserInfo, 
  getAllUsers, 
  registerUser, 
  sendVerifyCode,
  verifyResetCode,
  resetPassword,
  authUser,
  updateAvatar, 
  getAvatar, 
  updateUserInfo, 
  updatePassword,
  updateUserRole, 
  deleteAccount,
  deleteAccountByAdmin,
} from "../controllers/userController.js";

import { authUserMiddleware, authAdminMiddleware } from "../middleware/authMiddleware.js";
import gridMiddleware from "../middleware/gridMiddleware.js";

router.get('/', authUserMiddleware, getUserInfo);
router.post('/getallusers', authAdminMiddleware, getAllUsers);
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/resetPasswordRequest', sendVerifyCode);
router.post('/verify', verifyResetCode);
router.post('/resetPassword', resetPassword);
router.post('/avatar', gridMiddleware.single("file"), updateAvatar);
router.get('/avatar/:id', getAvatar);
router.post('/updateRole', authAdminMiddleware, updateUserRole);
router.post('/updateinfo', authUserMiddleware, updateUserInfo);
router.post('/updatepassword', authUserMiddleware, updatePassword);
router.post('/delete', authUserMiddleware, deleteAccount);
router.post('/deleteUserByAdmin', authAdminMiddleware, deleteAccountByAdmin);

export default router;