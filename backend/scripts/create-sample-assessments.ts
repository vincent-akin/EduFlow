import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import logger from '../src/utils/logger.js';
import { School } from '../src/modules/schools/school.model.js';
import { Class } from '../src/modules/classes/class.model.js';
import { Subject } from '../src/modules/subjects/subject.model.js';
import { User } from '../src/modules/users/user.model.js';
import { StudentProfile } from '../src/modules/students/student.model.js';
import { Assessment } from '../src/modules/assessments/assessment.model.js';
import { Submission } from '../src/modules/submissions/submission.model.js';
import { Result } from '../src/modules/results/result.model.js';
import { AcademicSession } from '../src/modules/sessions/session.model.js';
import { AcademicTerm } from '../src/modules/sessions/term.model.js';
import { Question } from '../src/modules/questions/question.model.js';

const createSampleData = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('✅ Connected to MongoDB');

    // Get school
    const school = await School.findOne({ slug: 'eduflow-demo' });
    if (!school) {
      logger.error('❌ School not found. Run seed first.');
      process.exit(1);
    }

    // Get session and term
    const session = await AcademicSession.findOne({ schoolId: school._id, isActive: true });
    const term = await AcademicTerm.findOne({ schoolId: school._id, sessionId: session?._id, isActive: true });

    // Get teacher
    const teacher = await User.findOne({ schoolId: school._id, role: 'teacher' });
    if (!teacher) {
      logger.error('❌ Teacher not found');
      process.exit(1);
    }

    // Get classes and subjects
    const classes = await Class.find({ schoolId: school._id });
    const subjects = await Subject.find({ schoolId: school._id });

    if (classes.length === 0 || subjects.length === 0) {
      logger.error('❌ No classes or subjects found');
      process.exit(1);
    }

    // Get some questions to use
    const questions = await Question.find({ schoolId: school._id }).limit(10);
    if (questions.length === 0) {
      logger.warn('⚠️ No questions found. Creating sample questions...');
      // Create sample questions if none exist
      for (let i = 0; i < 10; i++) {
        const subject = subjects[i % subjects.length];
        await Question.create({
          schoolId: school._id,
          subjectId: subject._id,
          createdBy: teacher._id,
          type: i % 2 === 0 ? 'mcq' : 'theory',
          curriculum: 'WAEC',
          topic: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'][i % 5],
          difficulty: ['easy', 'medium', 'hard'][i % 3],
          marks: 5,
          questionText: `Sample question ${i + 1} for ${subject.name}`,
          options: i % 2 === 0 ? [
            { key: 'A', text: 'Option A', isCorrect: true },
            { key: 'B', text: 'Option B', isCorrect: false },
            { key: 'C', text: 'Option C', isCorrect: false },
            { key: 'D', text: 'Option D', isCorrect: false },
          ] : [],
          correctAnswer: i % 2 === 0 ? 'A' : 'Sample answer',
          explanation: 'Sample explanation',
          tags: ['sample', 'test'],
        });
      }
      logger.info('✅ Created 10 sample questions');
    }

    // Get updated questions list
    const updatedQuestions = await Question.find({ schoolId: school._id }).limit(10);
    if (updatedQuestions.length === 0) {
      logger.error('❌ No questions available');
      process.exit(1);
    }

    logger.info(`📚 Found ${classes.length} classes, ${subjects.length} subjects, ${updatedQuestions.length} questions`);

    // Create assessments
    const assessmentTypes = ['quiz', 'test', 'assignment', 'exam'];
    const assessmentTitles = [
      'Mathematics Quiz 1', 'Algebra Test', 'Geometry Assignment', 'Calculus Exam',
      'English Grammar Quiz', 'Literature Test', 'Essay Assignment', 'Comprehension Exam',
      'Biology Quiz', 'Genetics Test', 'Ecology Assignment', 'Anatomy Exam',
      'Physics Quiz', 'Mechanics Test', 'Optics Assignment', 'Thermodynamics Exam',
      'Chemistry Quiz', 'Organic Test', 'Inorganic Assignment', 'Biochemistry Exam',
    ];

    const assessments = [];
    let totalMarks = 0;
    let obtainedMarks = 0;
    let totalResults = 0;

    for (let i = 0; i < 8; i++) {
      const classItem = classes[i % classes.length];
      const subject = subjects[i % subjects.length];
      const type = assessmentTypes[i % assessmentTypes.length];
      const title = assessmentTitles[i % assessmentTitles.length];
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + i * 2);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 1);

      // Select random questions for this assessment
      const selectedQuestions = [];
      const numQuestions = Math.min(5 + (i % 5), updatedQuestions.length);
      const shuffled = [...updatedQuestions].sort(() => 0.5 - Math.random());
      
      for (let j = 0; j < numQuestions; j++) {
        const q = shuffled[j];
        if (q) {
          selectedQuestions.push({
            questionId: q._id,
            order: j + 1,
            marks: q.marks || 5,
            snapshot: {
              type: q.type,
              questionText: q.questionText,
              options: q.options || [],
              correctAnswer: q.correctAnswer,
              explanation: q.explanation || '',
              difficulty: q.difficulty || 'medium',
              topic: q.topic || 'General',
            },
          });
        }
      }

      const totalMarksForAssessment = selectedQuestions.reduce((sum, q) => sum + q.marks, 0);

      const assessment = await Assessment.create({
        schoolId: school._id,
        sessionId: session?._id,
        termId: term?._id,
        classId: classItem._id,
        subjectId: subject._id,
        createdBy: teacher._id,
        title: `${subject.name} - ${title}`,
        description: `Sample ${type} for ${classItem.name}`,
        type: type,
        deliveryMode: 'cbt',
        instructions: 'Answer all questions',
        durationMinutes: 30 + (i % 30),
        totalMarks: totalMarksForAssessment || 20,
        passMark: 40,
        shuffleQuestions: false,
        shuffleOptions: false,
        allowReview: true,
        startTime: startDate,
        endTime: endDate,
        status: 'published',
        questionCount: selectedQuestions.length,
        questions: selectedQuestions,
        publishedAt: new Date(),
        publishedBy: teacher._id,
      });

      assessments.push(assessment);
      logger.info(`✅ Created assessment: ${assessment.title} (${selectedQuestions.length} questions)`);

      // Create submissions and results for students
      const students = await StudentProfile.find({ 
        schoolId: school._id, 
        classId: classItem._id 
      });

      if (students.length === 0) {
        logger.warn(`⚠️ No students in class ${classItem.name}, skipping results`);
        continue;
      }

      // Take up to 5 students per class
      const studentsToUse = students.slice(0, Math.min(5, students.length));

      for (const student of studentsToUse) {
        const total = assessment.totalMarks;
        const score = Math.min(Math.floor(Math.random() * total * 0.8) + (total * 0.2), total);
        
        try {
          const submission = await Submission.create({
            schoolId: school._id,
            assessmentId: assessment._id,
            studentId: student.userId,
            attemptNumber: 1,
            startedAt: new Date(),
            submittedAt: new Date(),
            timeSpentSeconds: Math.floor(Math.random() * 600) + 60,
            status: 'graded',
            answers: selectedQuestions.map((q, idx) => ({
              questionId: q.questionId,
              selectedOption: q.snapshot.type === 'mcq' ? ['A', 'B', 'C', 'D'][idx % 4] : null,
              answerText: q.snapshot.type === 'theory' ? 'Sample answer text' : null,
              obtainedMarks: Math.random() > 0.3 ? q.marks : 0,
              isCorrect: Math.random() > 0.3,
              answeredAt: new Date(),
            })),
            autoScore: score,
            manualScore: 0,
            finalScore: score,
            gradedBy: teacher._id,
            gradedAt: new Date(),
          });

          const percentage = total > 0 ? (score / total) * 100 : 0;
          let grade = 'F';
          if (percentage >= 80) grade = 'A';
          else if (percentage >= 70) grade = 'B';
          else if (percentage >= 60) grade = 'C';
          else if (percentage >= 50) grade = 'D';
          else if (percentage >= 40) grade = 'E';

          await Result.create({
            schoolId: school._id,
            submissionId: submission._id,
            assessmentId: assessment._id,
            studentId: student.userId,
            classId: classItem._id,
            subjectId: subject._id,
            totalMarks: total,
            obtainedMarks: score,
            percentage: percentage,
            grade: grade,
            remark: grade === 'A' ? 'Excellent' : grade === 'B' ? 'Very Good' : grade === 'C' ? 'Good' : 'Fair',
            publishedBy: teacher._id,
            publishedAt: new Date(),
            status: 'published',
          });

          totalMarks += total;
          obtainedMarks += score;
          totalResults++;
        } catch (err) {
          // Skip if error (e.g., duplicate submission)
          logger.warn(`⚠️ Skipping student ${student.userId}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }
    }

    const avgScore = totalResults > 0 ? (obtainedMarks / totalMarks) * 100 : 0;

    logger.info(`\n📊 Sample data created:`);
    logger.info(`  Assessments: ${assessments.length}`);
    logger.info(`  Results: ${totalResults}`);
    logger.info(`  Average Score: ${avgScore.toFixed(1)}%`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Failed to create sample data:', error);
    process.exit(1);
  }
};

createSampleData();