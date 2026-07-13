import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../../config/env.js';
import { User } from '../users/user.model.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { ERROR_MESSAGES } from '../../shared/constants/errors.js';
import { JwtPayload } from '../../shared/interfaces/base.interface.js';

export const register = async (userData: any) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError(ERROR_MESSAGES.USER_ALREADY_EXISTS, 409);
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);
  
  const user = new User({
    ...userData,
    passwordHash,
    fullName: `${userData.firstName} ${userData.lastName}`,
    emailVerified: false,
  });

  await user.save();

  // Generate email verification token
  // Uncomment when email service is ready
  /*
  const verificationToken = jwt.sign(
    { email: user.email, userId: user._id },
    env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  // Send verification email (implement this)
  // await sendVerificationEmail(user.email, verificationToken);
  */

  return { 
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
    message: 'User registered successfully. Please verify your email.' 
  };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  if (!user.isActive) {
    throw new AppError(ERROR_MESSAGES.USER_INACTIVE, 401);
  }

  if (!user.emailVerified) {
    throw new AppError('Please verify your email before logging in', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  user.lastLoginAt = new Date();
  await user.save();

  const payload: JwtPayload = {
    id: user._id.toString(),
    schoolId: user.schoolId.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });

  return {
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    },
    accessToken,
    refreshToken,
  };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists or not for security
    return { message: 'If your email exists, you will receive a reset link' };
  }

  // Generate reset token (short-lived)
  const resetToken = jwt.sign(
    { email: user.email, userId: user._id },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Save reset token to user
  (user as any).resetPasswordToken = resetToken;
  (user as any).resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  // Send reset email (implement this)
  // await sendPasswordResetEmail(user.email, resetToken);

  return { message: 'If your email exists, you will receive a reset link' };
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    const user = await User.findOne({ 
      email: decoded.email,
      // @ts-ignore - resetPasswordToken field exists on the model
      resetPasswordToken: token,
      // @ts-ignore - resetPasswordExpires field exists on the model
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    (user as any).resetPasswordToken = null;
    (user as any).resetPasswordExpires = null;
    await user.save();

    return { message: 'Password reset successful' };
  } catch (error) {
    throw new AppError('Invalid or expired reset token', 400);
  }
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = passwordHash;
  await user.save();

  return { message: 'Password changed successfully' };
};

export const verifyEmail = async (token: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('Invalid verification token', 400);
    }

    if (user.emailVerified) {
      return { message: 'Email already verified' };
    }

    user.emailVerified = true;
    await user.save();

    return { message: 'Email verified successfully' };
  } catch (error) {
    throw new AppError('Invalid or expired verification token', 400);
  }
};

export const resendVerification = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.emailVerified) {
    throw new AppError('Email already verified', 400);
  }

  // Uncomment when email service is ready
  /*
  const verificationToken = jwt.sign(
    { email: user.email, userId: user._id },
    env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  // Send verification email (implement this)
  // await sendVerificationEmail(user.email, verificationToken);
  */

  return { message: 'Verification email sent' };
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
    
    const payload: JwtPayload = {
      id: decoded.id,
      schoolId: decoded.schoolId,
      email: decoded.email,
      role: decoded.role,
    };

    const newAccessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new AppError(ERROR_MESSAGES.TOKEN_INVALID, 401);
  }
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};