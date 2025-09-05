export const getExamResult = async (resultId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock detailed result data
  return {
    id: resultId,
    examTitle: 'Mathematics Final Exam',
    studentName: 'John Doe',
    completedAt: '2024-01-20T15:30:00Z',
    duration: 120,
    timeTaken: 95,
    totalQuestions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,
    skippedQuestions: 0,
    totalMarks: 100,
    obtainedMarks: 80,
    percentage: 80,
    grade: 'A-',
    status: 'Passed' as const,
    subjectWisePerformance: [
      {
        subject: 'Algebra',
        totalQuestions: 4,
        correctAnswers: 3,
        percentage: 75
      },
      {
        subject: 'Calculus',
        totalQuestions: 3,
        correctAnswers: 3,
        percentage: 100
      },
      {
        subject: 'Geometry',
        totalQuestions: 2,
        correctAnswers: 1,
        percentage: 50
      },
      {
        subject: 'Trigonometry',
        totalQuestions: 1,
        correctAnswers: 1,
        percentage: 100
      }
    ],
    questionResults: [
      {
        questionId: 'q1',
        question: 'What is the derivative of x² + 3x + 2?',
        correctAnswer: '2x + 3',
        studentAnswer: '2x + 3',
        isCorrect: true,
        marks: 10,
        obtainedMarks: 10,
        explanation: 'The derivative of x² is 2x, the derivative of 3x is 3, and the derivative of a constant is 0.'
      },
      {
        questionId: 'q2',
        question: 'Solve for x: 2x + 5 = 13',
        correctAnswer: 'x = 4',
        studentAnswer: 'x = 4',
        isCorrect: true,
        marks: 10,
        obtainedMarks: 10,
        explanation: 'Subtract 5 from both sides: 2x = 8. Then divide by 2: x = 4.'
      },
      {
        questionId: 'q3',
        question: 'What is the area of a circle with radius 5?',
        correctAnswer: '25π',
        studentAnswer: '10π',
        isCorrect: false,
        marks: 10,
        obtainedMarks: 0,
        explanation: 'Area of circle = πr². With radius 5: π × 5² = 25π.'
      },
      {
        questionId: 'q4',
        question: 'Is the function f(x) = x³ continuous everywhere?',
        correctAnswer: 'True',
        studentAnswer: 'True',
        isCorrect: true,
        marks: 10,
        obtainedMarks: 10,
        explanation: 'Polynomial functions are continuous everywhere on their domain.'
      },
      {
        questionId: 'q5',
        question: 'What is the limit of (sin x)/x as x approaches 0?',
        correctAnswer: '1',
        studentAnswer: '0',
        isCorrect: false,
        marks: 10,
        obtainedMarks: 0,
        explanation: 'This is a fundamental limit in calculus: lim(x→0) (sin x)/x = 1.'
      },
      {
        questionId: 'q6',
        question: 'Simplify: √(16x⁴)',
        correctAnswer: '4x²',
        studentAnswer: '4x²',
        isCorrect: true,
        marks: 10,
        obtainedMarks: 10,
        explanation: '√(16x⁴) = √16 × √(x⁴) = 4 × x² = 4x².'
      },
      {
        questionId: 'q7',
        question: 'What is the slope of the line y = 3x - 7?',
        correctAnswer: '3',
        studentAnswer: '3',
        isCorrect: true,
        marks: 10,
        obtainedMarks: 10,
        explanation: 'In the form y = mx + b, m is the slope. Here m = 3.'
      },
      {
        questionId: 'q8',
        question: 'Factor: x² - 9',
        correctAnswer: '(x+3)(x-3)',
        studentAnswer: '(x+3)(x-3)',
        isCorrect: true,
        marks: 10,
        obtainedMarks: 10,
        explanation: 'This is a difference of squares: a² - b² = (a+b)(a-b).'
      },
      {
        questionId: 'q9',
        question: 'What is log₂(8)?',
        correctAnswer: '3',
        studentAnswer: '3',
        isCorrect: true,
        marks: 10,
        obtainedMarks: 10,
        explanation: 'log₂(8) asks "what power of 2 gives 8?" Since 2³ = 8, the answer is 3.'
      },
      {
        questionId: 'q10',
        question: 'Is every rational number also a real number?',
        correctAnswer: 'True',
        studentAnswer: 'True',
        isCorrect: true,
        marks: 10,
        obtainedMarks: 10,
        explanation: 'Rational numbers are a subset of real numbers.'
      }
    ],
    recommendations: [
      'Focus on limit problems - practice more questions involving limits',
      'Review circle area formulas and other geometric formulas',
      'Strong performance in algebra and calculus - keep it up!',
      'Consider taking practice tests for geometry topics'
    ]
  };
};