import { Request, Response, NextFunction } from 'express';
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

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await register(req.body);
    ResponseHelper.success(res, result, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    const result = await login(email, password);

    ResponseHelper.success(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
      return;
    }

    const result = await refreshTokenService(refreshToken);

    ResponseHelper.success(res, result, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

export const meController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const user = await getMe(userId);

    ResponseHelper.success(
      res,
      user,
      'User profile retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

// ============ Password Management ============

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    const result = await forgotPassword(email);

    ResponseHelper.success(
      res,
      result,
      'Password reset email sent'
    );
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    const result = await resetPassword(token, newPassword);

    ResponseHelper.success(
      res,
      result,
      'Password reset successful'
    );
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user.id;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
      return;
    }

    const result = await changePassword(
      userId,
      currentPassword,
      newPassword
    );

    ResponseHelper.success(
      res,
      result,
      'Password changed successfully'
    );
  } catch (error) {
    next(error);
  }
};

// ============ Email Verification ============

export const verifyEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
      return;
    }

    const result = await verifyEmail(token);

    ResponseHelper.success(
      res,
      result,
      'Email verified successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const resendVerificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    const result = await resendVerification(email);

    ResponseHelper.success(
      res,
      result,
      'Verification email sent'
    );
  } catch (error) {
    next(error);
  }
};

// ============ Logout ============

export const logoutController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    ResponseHelper.success(
      res,
      null,
      'Logged out successfully'
    );
  } catch (error) {
    next(error);
  }
};