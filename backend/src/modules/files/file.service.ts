import { File, IFile } from './file.model.js';
import { Types } from 'mongoose';
import { AppError } from '../../middlewares/error.middleware.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export const uploadFile = async (
  file: any,
  userId: Types.ObjectId,
  schoolId: Types.ObjectId,
  category: string
): Promise<IFile> => {
  // This is a placeholder - in production, you'd use Cloudinary, AWS S3, etc.
  // For now, we'll simulate file upload
  
  const filename = `${uuidv4()}${path.extname(file.originalname)}`;
  const url = `/uploads/${filename}`;
  
  const fileData = {
    uploadedBy: userId,
    schoolId,
    filename,
    originalFilename: file.originalname,
    mimeType: file.mimetype,
    extension: path.extname(file.originalname),
    size: file.size,
    storageProvider: 'local' as const,
    path: `./uploads/${filename}`,
    url,
    category: category as any,
  };

  // Save to database
  const savedFile = new File(fileData);
  await savedFile.save();

  return savedFile;
};

export const getFileById = async (id: string): Promise<IFile> => {
  const file = await File.findById(id);
  if (!file) {
    throw new AppError('File not found', 404);
  }
  return file;
};

export const getFilesByCategory = async (
  schoolId: Types.ObjectId,
  category: string,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;
  const query = { schoolId, category, deletedAt: null };
  const [data, total] = await Promise.all([
    File.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    File.countDocuments(query),
  ]);
  return { data, total };
};

export const getFilesByUser = async (
  userId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;
  const query = { uploadedBy: userId, deletedAt: null };
  const [data, total] = await Promise.all([
    File.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    File.countDocuments(query),
  ]);
  return { data, total };
};

export const deleteFile = async (id: string): Promise<IFile> => {
  const file = await File.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    { new: true }
  );
  if (!file) {
    throw new AppError('File not found', 404);
  }
  
  // Delete physical file if it exists locally
  if (file.storageProvider === 'local' && fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }
  
  return file;
};