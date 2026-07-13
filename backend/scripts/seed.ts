import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import logger from '../src/utils/logger.js';
import { School } from '../src/modules/schools/school.model.js';
import { User } from '../src/modules/users/user.model.js';
import { hashPassword } from '../src/utils/hasher.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // Clear existing data
    await School.deleteMany({});
    logger.info('✅ Cleared schools');
    
    await User.deleteMany({});
    logger.info('✅ Cleared users');

    // Create a test school
    logger.info('📝 Creating school...');
    const school = await School.create({
      name: 'EduFlow Demo School',
      slug: 'eduflow-demo',
      email: 'demo@eduflow.com',
      phone: '+2348001234567',
      address: '123 Education Avenue',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      timezone: 'Africa/Lagos',
      currency: 'NGN',
      isActive: true,
    });
    logger.info(`✅ Created school: ${school.name} (ID: ${school._id})`);

    // Create admin user
    logger.info('📝 Creating admin user...');
    const adminPassword = await hashPassword('Admin@123');
    const admin = await User.create({
      schoolId: school._id,
      firstName: 'Admin',
      lastName: 'User',
      fullName: 'Admin User',
      email: 'admin@eduflow.com',
      passwordHash: adminPassword,
      role: 'school_admin',
      emailVerified: true,
      isActive: true,
    });
    logger.info(`✅ Created admin: ${admin.email}`);

    // Create teacher user
    logger.info('📝 Creating teacher user...');
    const teacherPassword = await hashPassword('Teacher@123');
    const teacher = await User.create({
      schoolId: school._id,
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      email: 'teacher@eduflow.com',
      passwordHash: teacherPassword,
      role: 'teacher',
      emailVerified: true,
      isActive: true,
    });
    logger.info(`✅ Created teacher: ${teacher.email}`);

    // Create student user
    logger.info('📝 Creating student user...');
    const studentPassword = await hashPassword('Student@123');
    const student = await User.create({
      schoolId: school._id,
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      email: 'student@eduflow.com',
      passwordHash: studentPassword,
      role: 'student',
      emailVerified: true,
      isActive: true,
    });
    logger.info(`✅ Created student: ${student.email}`);

    logger.info('🎉 Database seeded successfully!');
    logger.info('📝 Login credentials:');
    logger.info(`  Admin: admin@eduflow.com / Admin@123`);
    logger.info(`  Teacher: teacher@eduflow.com / Teacher@123`);
    logger.info(`  Student: student@eduflow.com / Student@123`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seed failed:', error);
    // Log more details
    if (error instanceof Error) {
      logger.error('Error message:', error.message);
      logger.error('Error stack:', error.stack);
    }
    process.exit(1);
  }
};

seedDatabase();