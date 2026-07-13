import mongoose, { Schema } from 'mongoose';
import { BaseSchema } from '../../shared/models/base.model.js';
import { BaseDocument } from '../../shared/interfaces/base.interface.js';

export interface IRole extends BaseDocument {
  schoolId: mongoose.Types.ObjectId;
  name: string;
  permissions: string[];
  description?: string;
  isSystem: boolean;
  isActive: boolean;
}

const RoleSchema = new Schema<IRole>(
  {
    ...BaseSchema,
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    permissions: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      default: null,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

RoleSchema.index({ schoolId: 1, name: 1 }, { unique: true });

export const Role = mongoose.model<IRole>('Role', RoleSchema);