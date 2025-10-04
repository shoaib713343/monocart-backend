import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../../db';
import { users } from '../../db/schema';
import {eq} from 'drizzle-orm';
import crypto from 'crypto';
import { sendEmail } from '../../utils/email';

export async function registerUserHandler(req: Request, res: Response, next: NextFunction){
    const {fullName, email, password} = req.body;

    try{
        const existingUser = await db
                            .select()
                            .from(users)
                            .where(eq(users.email, email));

        if(existingUser.length > 0){
            return res.status(409).json({message: 'User with this email already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPasword = await bcrypt.hash(password, salt);

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedVerificationToken = crypto
                .createHash('sha256')
                .update(verificationToken)
                .digest('hex');

        const [newUser] = await db
                            .insert(users)
                            .values({
                                fullName,
                                email,
                                password: hashedPasword,
                                emailVerificationToken: hashedVerificationToken,
                            })
                            .returning({
                                id: users.id,
                                fullName: users.fullName,
                                email: users.email,
                            });

        try {
            const verificationUrl = `http://localhost:3000/api/v1/users/verify-email/${verificationToken}`
            await sendEmail({
                to: newUser.email,
                subject: 'Verify Your MonoCart Account',
                text: `please verify your account by clicking this link: ${verificationUrl}`,
                html: `<p>Please verify your account by clicking <a href="${verificationUrl}">this link</a>.`
            })
        
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
        }
        return res.status(201).json(newUser);
    } catch (e) {
        return next(e);
    }
}

export async function loginUserHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { email, password } = req.body;

    try {
        const user = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, email));
        if(user.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password'});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user[0].password);

        const secret = process.env.JWT_SECRET!;
         const token = jwt.sign(
      { 
        id: user[0].id, 
        email: user[0].email, 
        fullName: user[0].fullName,
        role: user[0].role,
        isEmailVerified: user[0].isEmailVerified, // Add this
        isPhoneVerified: user[0].isPhoneVerified, // Add this
      },
      secret,
      { expiresIn: '1d' }
    );

        return res.status(200).json({ accessToken: token});

    } catch (e) {
        return next(e);
    }
}

export async function verifyEmailHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { token } = req.params;

        const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const [user] = await db
    .select()
    .from(users)
    .where(eq(users.emailVerificationToken, hashedToken));

    if(!user){
        return res.status(400).json({message: "Invalid verification token"});
    }

    await db
        .update(users)
        .set({ isEmailVerified: true, emailVerificationToken: null})
        .where(eq(users.id, user.id));
    return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        return next(error);
    }
}

export async function sendPhoneOtpHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.user!.id;
        const {phone} = req.body;

        const otp = Math.floor(100000 + Math.random()*900000).toString();

          const expires = new Date(Date.now() + 10 * 60 * 1000);

           await db
      .update(users)
      .set({ phone, phoneOtp: otp, phoneOtpExpires: expires })
      .where(eq(users.id, userId));

    // In a real app, we would send an SMS here. We log it instead.
    console.log(`📱 OTP for user ${userId} is: ${otp}`);

    return res.status(200).json({ message: 'OTP sent successfully' })
    } catch (error) {
        return next(error);
    }
}

export async function verifyPhoneOtpHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const { otp } = req.body;

    const [user] = await db.select().from(users).where(eq(users.id, userId));

     if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isOtpValid = user.phoneOtp === otp;

    const isOtpExpired = user.phoneOtpExpires && user.phoneOtpExpires < new Date();

    if (!isOtpValid || isOtpExpired) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }


    // Mark phone as verified and clear OTP fields
    await db
      .update(users)
      .set({ 
        isPhoneVerified: true, 
        phoneOtp: null, 
        phoneOtpExpires: null 
      })
      .where(eq(users.id, userId));

      return res.status(200).json({ message: 'Phone number verified successfully' });

        } catch (error) {
    return next(error);
  }
}

export async function getProfileHandler(req: Request, res: Response){
    return res.status(200).json(req.user);
}