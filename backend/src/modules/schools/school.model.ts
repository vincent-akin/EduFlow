import mongoose, { Schema } from 'mongoose';
import { BaseSoftDeleteSchema } from '../../shared/models/base.model.js';
import { SoftDeleteDocument } from '../../shared/interfaces/base.interface.js';

export interface ISchool extends SoftDeleteDocument {
    name: string;
    slug: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    timezone: string;
    currency: string;
    logoUrl: string;
    website: string;
    settings: {
        gradingSystem: string;
        defaultLanguage: string;
        allowStudentDownloads: boolean;
        allowParentPortal: boolean;
        branding: {
        primaryColor: string;
        secondaryColor: string;
        };
    };
    isActive: boolean;
}

const SchoolSchema = new Schema<ISchool>(
  {
    ...BaseSoftDeleteSchema,
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: 'Nigeria',
    },
    timezone: {
      type: String,
      default: 'Africa/Lagos',
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    settings: {
      gradingSystem: {
        type: String,
        default: 'standard',
      },
      defaultLanguage: {
        type: String,
        default: 'en',
      },
      allowStudentDownloads: {
        type: Boolean,
        default: true,
      },
      allowParentPortal: {
        type: Boolean,
        default: false,
      },
      branding: {
        primaryColor: {
          type: String,
          default: '#3B82F6',
        },
        secondaryColor: {
          type: String,
          default: '#10B981',
        },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

//SchoolSchema.index({ slug: 1 }, { unique: true });
SchoolSchema.index({ name: 1 });
SchoolSchema.index({ isActive: 1 });

export const School = mongoose.model<ISchool>('School', SchoolSchema);