import { Request, Response } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  resendVerification,
  refreshToken as refreshTokenService,
  getMe,
} from './auth.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';

// ============ Registration & Login ============

export const registerController = async (req: Request, res: Response): Promise<Response> => {
  const result = await register(req.body);
  return ResponseHelper.success(res, result, 'User registered successfully', 201);
};

export const loginController = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  if (!email || !password) {
    return ResponseHelper.error(res, 'Email and password are required', 400);
  }
  const result = await login(email, password);
  return ResponseHelper.success(res, result, 'Login successful');
};

export const refreshTokenController = async (req: Request, res: Response): Promise<Response> => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return ResponseHelper.error(res, 'Refresh token is required', 400);
  }
  const result = await refreshTokenService(refreshToken);
  return ResponseHelper.success(res, result, 'Token refreshed successfully');
};

export const meController = async (req: Request, res: Response): Promise<Response> => {
  const userId = (req as any).user.id;
  const user = await getMe(userId);
  return ResponseHelper.success(res, user, 'User profile retrieved successfully');
};

// ============ Password Management ============

export const forgotPasswordController = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;
  if (!email) {
    return ResponseHelper.error(res, 'Email is required', 400);
  }
  const result = await forgotPassword(email);
  return ResponseHelper.success(res, result, 'Password reset email sent');
};

export const resetPasswordController = async (req: Request, res: Response): Promise<Response> => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return ResponseHelper.error(res, 'Token and new password are required', 400);
  }
  if (newPassword.length < 6) {
    return ResponseHelper.error(res, 'Password must be at least 6 characters', 400);
  }
  const result = await resetPassword(token, newPassword);
  return ResponseHelper.success(res, result, 'Password reset successful');
};

export const changePasswordController = async (req: Request, res: Response): Promise<Response> => {
  const { currentPassword, newPassword } = req.body;
  const userId = (req as any).user.id;
  
  if (!currentPassword || !newPassword) {
    return ResponseHelper.error(res, 'Current password and new password are required', 400);
  }
  if (newPassword.length < 6) {
    return ResponseHelper.error(res, 'Password must be at least 6 characters', 400);
  }
  
  const result = await changePassword(userId, currentPassword, newPassword);
  return ResponseHelper.success(res, result, 'Password changed successfully');
};

// ============ Email Verification ============

export const verifyEmailController = async (req: Request, res: Response): Promise<Response> => {
  const { token } = req.params;
  if (!token) {
    return ResponseHelper.error(res, 'Verification token is required', 400);
  }
  const result = await verifyEmail(token);
  return ResponseHelper.success(res, result, 'Email verified successfully');
};

export const resendVerificationController = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;
  if (!email) {
    return ResponseHelper.error(res, 'Email is required', 400);
  }
  const result = await resendVerification(email);
  return ResponseHelper.success(res, result, 'Verification email sent');
};

// ============ Logout ============

export const logoutController = async (_req: Request, res: Response): Promise<Response> => {
  // Since we're using JWT, logout is handled client-side
  // Just return success response
  return ResponseHelper.success(res, null, 'Logged out successfully');
};