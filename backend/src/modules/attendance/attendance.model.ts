import mongoose, { Schema } from 'mongoose';
import { BaseSchema } from '../../shared/models/base.model.js';
import { BaseDocument } from '../../shared/interfaces/base.interface.js';

export interface IAttendance extends BaseDocument {
  schoolId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: Date;
  checkOutTime?: Date;
  markedBy: mongoose.Types.ObjectId;
  remark?: string;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    ...BaseSchema,
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: true,
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    remark: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

AttendanceSchema.index({ schoolId: 1, studentId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ schoolId: 1, classId: 1, date: 1 });

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);