import { email, z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, { message: 'Full name is required' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email('Not a valid email'),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

export const loginUserSchema = z.object({
    body: z.object({
        email: z
            .string()
            .min(1, {message: 'Email is required'})
            .email('Not a valid email'),
        password: z.string().min(1, {message: 'Password is required'}),
    }),
});


export const sendPhoneOtpSchema = z.object({
  body: z.object({
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  }),
});


export const verifyPhoneOtpSchema = z.object({
  body: z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});