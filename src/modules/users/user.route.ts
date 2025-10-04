import {Router} from 'express';
import { getProfileHandler, loginUserHandler, registerUserHandler, sendPhoneOtpHandler, verifyEmailHandler, verifyPhoneOtpHandler} from "./user.controller";
import { loginUserSchema, registerUserSchema, sendPhoneOtpSchema, verifyPhoneOtpSchema } from './user.schema';
import { validate } from '../../middleware/validate';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.post('/register', validate(registerUserSchema), registerUserHandler);
router.post('/login',validate(loginUserSchema), loginUserHandler);
router.get('/verify-email/:token', verifyEmailHandler);

router.get('/profile', authMiddleware, getProfileHandler);
router.post('/send-phone-otp', authMiddleware, validate(sendPhoneOtpSchema), sendPhoneOtpHandler)
router.post('/verify-phone-otp', authMiddleware, validate(verifyPhoneOtpSchema), verifyPhoneOtpHandler);

export default router;