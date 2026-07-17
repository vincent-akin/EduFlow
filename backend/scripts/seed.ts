import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import logger from '../src/utils/logger.js';
import { School } from '../src/modules/schools/school.model.js';
import { User } from '../src/modules/users/user.model.js';
import { StudentProfile } from '../src/modules/students/student.model.js';
import { TeacherProfile } from '../src/modules/teachers/teacher.model.js';
import { Parent } from '../src/modules/parents/parent.model.js';
import { Class } from '../src/modules/classes/class.model.js';
import { Subject } from '../src/modules/subjects/subject.model.js';
import { AcademicSession } from '../src/modules/sessions/session.model.js';
import { AcademicTerm } from '../src/modules/sessions/term.model.js';
import { hashPassword } from '../src/utils/hasher.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // Clear existing data
    await School.deleteMany({});
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await TeacherProfile.deleteMany({});
    await Parent.deleteMany({});
    await Class.deleteMany({});
    await Subject.deleteMany({});
    await AcademicSession.deleteMany({});
    await AcademicTerm.deleteMany({});
    logger.info('✅ Cleared existing data');

    // Create school
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

    // Create academic session
    const session = await AcademicSession.create({
      schoolId: school._id,
      sessionName: '2024/2025',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-08-31'),
      isActive: true,
      createdBy: new mongoose.Types.ObjectId(),
    });
    logger.info(`✅ Created academic session: ${session.sessionName}`);

    // Create terms
    const terms = await AcademicTerm.create([
      {
        schoolId: school._id,
        sessionId: session._id,
        name: 'First Term',
        order: 1,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-12-15'),
        isActive: true,
      },
      {
        schoolId: school._id,
        sessionId: session._id,
        name: 'Second Term',
        order: 2,
        startDate: new Date('2025-01-10'),
        endDate: new Date('2025-04-10'),
        isActive: false,
      },
      {
        schoolId: school._id,
        sessionId: session._id,
        name: 'Third Term',
        order: 3,
        startDate: new Date('2025-04-20'),
        endDate: new Date('2025-07-20'),
        isActive: false,
      },
    ]);
    logger.info(`✅ Created 3 academic terms`);

    // Create classes
    const classes = await Class.create([
      {
        schoolId: school._id,
        name: 'SS 1A',
        level: 'SS1',
        isActive: true,
      },
      {
        schoolId: school._id,
        name: 'SS 1B',
        level: 'SS1',
        isActive: true,
      },
      {
        schoolId: school._id,
        name: 'SS 2A',
        level: 'SS2',
        isActive: true,
      },
      {
        schoolId: school._id,
        name: 'SS 2B',
        level: 'SS2',
        isActive: true,
      },
      {
        schoolId: school._id,
        name: 'SS 3A',
        level: 'SS3',
        isActive: true,
      },
      {
        schoolId: school._id,
        name: 'SS 3B',
        level: 'SS3',
        isActive: true,
      },
    ]);
    logger.info(`✅ Created ${classes.length} classes`);

    // Create subjects
    const subjects = await Subject.create([
      { schoolId: school._id, name: 'Mathematics', code: 'MTH101', isCore: true, isActive: true },
      { schoolId: school._id, name: 'English Language', code: 'ENG101', isCore: true, isActive: true },
      { schoolId: school._id, name: 'Biology', code: 'BIO101', isCore: false, isActive: true },
      { schoolId: school._id, name: 'Physics', code: 'PHY101', isCore: false, isActive: true },
      { schoolId: school._id, name: 'Chemistry', code: 'CHE101', isCore: false, isActive: true },
      { schoolId: school._id, name: 'History', code: 'HIS101', isCore: false, isActive: true },
      { schoolId: school._id, name: 'Geography', code: 'GEO101', isCore: false, isActive: true },
      { schoolId: school._id, name: 'Further Mathematics', code: 'FMT101', isCore: false, isActive: true },
    ]);
    logger.info(`✅ Created ${subjects.length} subjects`);

    // Create admin user
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

    // Create teacher users with profiles
    const teacherData = [
      { firstName: 'John', lastName: 'Doe', email: 'teacher@eduflow.com', dept: 'Science' },
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@eduflow.com', dept: 'Science' },
      { firstName: 'David', lastName: 'Williams', email: 'david.williams@eduflow.com', dept: 'Arts' },
      { firstName: 'Linda', lastName: 'Brown', email: 'linda.brown@eduflow.com', dept: 'Science' },
    ];

    for (let i = 0; i < teacherData.length; i++) {
      const t = teacherData[i];
      const password = await hashPassword('Teacher@123');
      const user = await User.create({
        schoolId: school._id,
        firstName: t.firstName,
        lastName: t.lastName,
        fullName: `${t.firstName} ${t.lastName}`,
        email: t.email,
        passwordHash: password,
        role: 'teacher',
        emailVerified: true,
        isActive: true,
      });

      await TeacherProfile.create({
        schoolId: school._id,
        userId: user._id,
        employeeId: `EMP-${String(i + 1).padStart(3, '0')}`,
        designation: i === 0 ? 'Senior Teacher' : 'Teacher',
        department: t.dept,
        assignedClasses: [classes[i % classes.length]._id, classes[(i + 1) % classes.length]._id],
        assignedSubjects: [subjects[i % subjects.length]._id, subjects[(i + 2) % subjects.length]._id],
        employmentDate: new Date(),
      });
      logger.info(`✅ Created teacher: ${user.email}`);
    }

    // Create student users with profiles
    const studentNames = [
      'Jane Smith', 'Michael Johnson', 'Emma Williams', 'James Brown',
      'Sophia Davis', 'Oliver Miller', 'Ava Wilson', 'Liam Moore',
      'Mia Taylor', 'Noah Anderson', 'Isabella Thomas', 'Lucas Jackson',
      'Charlotte White', 'Mason Harris', 'Amelia Martin'
    ];

    const studentUsers = [];

    for (let i = 0; i < studentNames.length; i++) {
      const [firstName, lastName] = studentNames[i].split(' ');
      const password = await hashPassword('Student@123');
      const user = await User.create({
        schoolId: school._id,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@eduflow.com`,
        passwordHash: password,
        role: 'student',
        emailVerified: true,
        isActive: true,
      });

      const student = await StudentProfile.create({
        schoolId: school._id,
        userId: user._id,
        admissionNumber: `STU-${String(i + 1).padStart(4, '0')}`,
        classId: classes[i % classes.length]._id,
        subjectIds: subjects.map(s => s._id),
        guardian: {
          name: `${lastName} Parent`,
          phone: '+2348001234567',
          email: `${firstName.toLowerCase()}.parent@email.com`,
        },
        enrollmentDate: new Date(),
      });
      
      studentUsers.push({ user, student });
      logger.info(`✅ Created student: ${user.email}`);
    }

    // ============================================
    // CREATE PARENTS
    // ============================================
    const parentData = [
      { firstName: 'Robert', lastName: 'Smith', phone: '+2348001111111', address: '123 Lagos St', occupation: 'Engineer' },
      { firstName: 'Mary', lastName: 'Johnson', phone: '+2348002222222', address: '456 Abuja St', occupation: 'Doctor' },
      { firstName: 'James', lastName: 'Williams', phone: '+2348003333333', address: '789 Ibadan St', occupation: 'Teacher' },
      { firstName: 'Patricia', lastName: 'Brown', phone: '+2348004444444', address: '321 Port Harcourt St', occupation: 'Business Owner' },
      { firstName: 'Michael', lastName: 'Davis', phone: '+2348005555555', address: '654 Enugu St', occupation: 'Lawyer' },
      { firstName: 'Jennifer', lastName: 'Miller', phone: '+2348006666666', address: '987 Kano St', occupation: 'Accountant' },
      { firstName: 'William', lastName: 'Wilson', phone: '+2348007777777', address: '147 Benin St', occupation: 'Architect' },
      { firstName: 'Elizabeth', lastName: 'Moore', phone: '+2348008888888', address: '258 Jos St', occupation: 'Pharmacist' },
    ];

    const parentUsers = [];

    for (let i = 0; i < parentData.length; i++) {
      const p = parentData[i];
      const password = await hashPassword('Parent@123');
      
      // Create parent user
      const user = await User.create({
        schoolId: school._id,
        firstName: p.firstName,
        lastName: p.lastName,
        fullName: `${p.firstName} ${p.lastName}`,
        email: `${p.firstName.toLowerCase()}.${p.lastName.toLowerCase()}@eduflow.com`,
        passwordHash: password,
        role: 'parent',
        emailVerified: true,
        isActive: true,
      });

      // Create parent profile
      const parent = await Parent.create({
        schoolId: school._id,
        userId: user._id,
        phone: p.phone,
        address: p.address,
        occupation: p.occupation,
        children: [], // Will link children below
        isActive: true,
      });

      parentUsers.push({ user, parent });
      logger.info(`✅ Created parent: ${user.email}`);
    }

    // Link parents to children (each parent gets 1-2 children)
    for (let i = 0; i < parentUsers.length; i++) {
      const parent = parentUsers[i];
      
      // Assign 1 or 2 children to each parent
      const numChildren = (i % 2 === 0) ? 2 : 1;
      const startIndex = (i * 2) % studentUsers.length;
      
      const assignedChildren = [];
      for (let j = 0; j < numChildren; j++) {
        const studentIndex = (startIndex + j) % studentUsers.length;
        const student = studentUsers[studentIndex];
        assignedChildren.push(student.student._id);
      }
      
      // Update parent with children
      parent.parent.children = assignedChildren;
      await parent.parent.save();
      logger.info(`✅ Linked parent ${parent.user.email} to ${assignedChildren.length} child(ren)`);
    }

    // Create parent user specifically for the seed (parent@eduflow.com)
    const parentPassword = await hashPassword('Parent@123');
    const defaultParent = await User.create({
      schoolId: school._id,
      firstName: 'Default',
      lastName: 'Parent',
      fullName: 'Default Parent',
      email: 'parent@eduflow.com',
      passwordHash: parentPassword,
      role: 'parent',
      emailVerified: true,
      isActive: true,
    });

    const defaultParentProfile = await Parent.create({
      schoolId: school._id,
      userId: defaultParent._id,
      phone: '+2348009999999',
      address: '999 School Road',
      occupation: 'Parent',
      children: [studentUsers[0].student._id, studentUsers[1].student._id],
      isActive: true,
    });
    logger.info(`✅ Created default parent: parent@eduflow.com`);

    logger.info('🎉 Database seeded successfully!');
    logger.info('\n📝 Login credentials:');
    logger.info(`  Admin: admin@eduflow.com / Admin@123`);
    logger.info(`  Teacher: teacher@eduflow.com / Teacher@123`);
    logger.info(`  Student: student@eduflow.com / Student@123`);
    logger.info(`  Parent: parent@eduflow.com / Parent@123`);
    logger.info(`\n📊 Database stats:`);
    logger.info(`  Schools: ${await School.countDocuments()}`);
    logger.info(`  Users: ${await User.countDocuments()}`);
    logger.info(`  Students: ${await StudentProfile.countDocuments()}`);
    logger.info(`  Teachers: ${await TeacherProfile.countDocuments()}`);
    logger.info(`  Parents: ${await Parent.countDocuments()}`);
    logger.info(`  Classes: ${await Class.countDocuments()}`);
    logger.info(`  Subjects: ${await Subject.countDocuments()}`);
    logger.info(`  Sessions: ${await AcademicSession.countDocuments()}`);
    logger.info(`  Terms: ${await AcademicTerm.countDocuments()}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();