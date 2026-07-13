import mongoose, { Schema } from 'mongoose';
import { BaseSchema } from '../../shared/models/base.model.js';
import { BaseDocument } from '../../shared/interfaces/base.interface.js';

export interface INotificationSettings extends BaseDocument {
  userId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  email: {
    enabled: boolean;
    assessmentReminders: boolean;
    resultPublished: boolean;
    classAnnouncements: boolean;
    messages: boolean;
    systemUpdates: boolean;
  };
  push: {
    enabled: boolean;
    assessmentReminders: boolean;
    resultPublished: boolean;
    classAnnouncements: boolean;
    messages: boolean;
    systemUpdates: boolean;
  };
  sms: {
    enabled: boolean;
    assessmentReminders: boolean;
    resultPublished: boolean;
    classAnnouncements: boolean;
    messages: boolean;
    systemUpdates: boolean;
  };
  inApp: {
    enabled: boolean;
    assessmentReminders: boolean;
    resultPublished: boolean;
    classAnnouncements: boolean;
    messages: boolean;
    systemUpdates: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
}

const NotificationSettingsSchema = new Schema<INotificationSettings>(
  {
    ...BaseSchema,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    email: {
      enabled: {
        type: Boolean,
        default: true,
      },
      assessmentReminders: {
        type: Boolean,
        default: true,
      },
      resultPublished: {
        type: Boolean,
        default: true,
      },
      classAnnouncements: {
        type: Boolean,
        default: true,
      },
      messages: {
        type: Boolean,
        default: true,
      },
      systemUpdates: {
        type: Boolean,
        default: true,
      },
    },
    push: {
      enabled: {
        type: Boolean,
        default: true,
      },
      assessmentReminders: {
        type: Boolean,
        default: true,
      },
      resultPublished: {
        type: Boolean,
        default: true,
      },
      classAnnouncements: {
        type: Boolean,
        default: true,
      },
      messages: {
        type: Boolean,
        default: true,
      },
      systemUpdates: {
        type: Boolean,
        default: true,
      },
    },
    sms: {
      enabled: {
        type: Boolean,
        default: false,
      },
      assessmentReminders: {
        type: Boolean,
        default: false,
      },
      resultPublished: {
        type: Boolean,
        default: false,
      },
      classAnnouncements: {
        type: Boolean,
        default: false,
      },
      messages: {
        type: Boolean,
        default: false,
      },
      systemUpdates: {
        type: Boolean,
        default: false,
      },
    },
    inApp: {
      enabled: {
        type: Boolean,
        default: true,
      },
      assessmentReminders: {
        type: Boolean,
        default: true,
      },
      resultPublished: {
        type: Boolean,
        default: true,
      },
      classAnnouncements: {
        type: Boolean,
        default: true,
      },
      messages: {
        type: Boolean,
        default: true,
      },
      systemUpdates: {
        type: Boolean,
        default: true,
      },
    },
    quietHours: {
      enabled: {
        type: Boolean,
        default: false,
      },
      start: {
        type: String,
        default: '22:00',
        match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      },
      end: {
        type: String,
        default: '07:00',
        match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      },
    },
  },
  {
    timestamps: true,
  }
);

NotificationSettingsSchema.index({ userId: 1, schoolId: 1 });

export const NotificationSettings = mongoose.model<INotificationSettings>(
  'NotificationSettings',
  NotificationSettingsSchema
);