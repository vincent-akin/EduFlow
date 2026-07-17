import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../src/config/env.js';
import { User } from '../src/modules/users/user.model.js';

async function main() {
  await mongoose.connect(env.MONGODB_URI);

  const users = await User.find({
    email: {
      $in: [
        'admin@eduflow.com',
        'teacher@eduflow.com',
        'student@eduflow.com',
      ],
    },
  });

  for (const user of users) {
    let password = '';

    switch (user.email) {
      case 'admin@eduflow.com':
        password = 'Admin@123';
        break;
      case 'teacher@eduflow.com':
        password = 'Teacher@123';
        break;
      case 'student@eduflow.com':
        password = 'Student@123';
        break;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    console.log({
      email: user.email,
      valid,
    });
  }

  await mongoose.disconnect();
}

main();