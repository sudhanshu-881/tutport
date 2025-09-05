// Mock data for student dashboard
export const getStudentDashboardData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    student: {
      name: 'John Doe',
      email: 'john@example.com',
      studentId: 'STU001',
      grade: '12th Grade'
    },
    availableExams: [
      {
        id: '1',
        title: 'Mathematics Final Exam',
        duration: 120,
        totalQuestions: 50,
        subject: 'Mathematics',
        difficulty: 'Hard' as const
      },
      {
        id: '2',
        title: 'Physics Chapter Test',
        duration: 60,
        totalQuestions: 30,
        subject: 'Physics',
        difficulty: 'Medium' as const
      },
      {
        id: '3',
        title: 'English Literature Quiz',
        duration: 45,
        totalQuestions: 25,
        subject: 'English',
        difficulty: 'Easy' as const
      }
    ],
    recentResults: [
      {
        id: 'r1',
        examTitle: 'Chemistry Mid-term',
        score: 85,
        totalMarks: 100,
        percentage: 85,
        completedAt: '2024-01-15T10:30:00Z',
        status: 'Passed' as const
      },
      {
        id: 'r2',
        examTitle: 'Biology Quiz',
        score: 42,
        totalMarks: 50,
        percentage: 84,
        completedAt: '2024-01-10T14:20:00Z',
        status: 'Passed' as const
      }
    ],
    stats: {
      totalExamsTaken: 15,
      averageScore: 78,
      bestScore: 95,
      totalHours: 45
    }
  };
};