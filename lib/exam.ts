export const getExamData = async (examId: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock exam data
  return {
    id: examId,
    title: 'Mathematics Final Exam',
    duration: 120,
    totalQuestions: 10,
    totalMarks: 100,
    instructions: [
      'Read all questions carefully before answering',
      'Each question carries equal marks unless specified',
      'Calculators are not allowed',
      'All questions are mandatory'
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is the derivative of x² + 3x + 2?',
        options: ['2x + 3', 'x² + 3', '2x + 2', 'x + 3'],
        type: 'multiple-choice' as const,
        marks: 10,
        subject: 'Mathematics',
        difficulty: 'Medium'
      },
      {
        id: 'q2',
        question: 'Solve for x: 2x + 5 = 13',
        options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
        type: 'multiple-choice' as const,
        marks: 10,
        subject: 'Mathematics',
        difficulty: 'Easy'
      },
      {
        id: 'q3',
        question: 'What is the area of a circle with radius 5?',
        options: ['25π', '10π', '15π', '30π'],
        type: 'multiple-choice' as const,
        marks: 10,
        subject: 'Mathematics',
        difficulty: 'Medium'
      },
      {
        id: 'q4',
        question: 'Is the function f(x) = x³ continuous everywhere?',
        options: ['True', 'False'],
        type: 'true-false' as const,
        marks: 10,
        subject: 'Mathematics',
        difficulty: 'Hard'
      },
      {
        id: 'q5',
        question: 'What is the limit of (sin x)/x as x approaches 0?',
        options: ['0', '1', '∞', 'undefined'],
        type: 'multiple-choice' as const,
        marks: 10,
        subject: 'Mathematics',
        difficulty: 'Hard'
      },
      {
        id: 'q6',
        question: 'Simplify: √(16x⁴)',
        options: ['4x²', '4x', '2x²', '8x²'],
        type: 'multiple-choice' as const,
        marks: 10,
        subject: 'Mathematics',
        difficulty: 'Medium'
      },
      {
        id: 'q7',
        question: 'What is the slope of the line y = 3x - 7?',
        options: ['3', '-7', '3x', '-3'],
        type: 'multiple-choice' as const,
        marks: 10,
        subject: 'Mathematics',
        difficulty: 'Easy'
      },
      {
        id: 'q8',
        question: 'Factor: x² - 9',
        options: ['(x+3)(x-3)', '(x+9)(x-9)', '(x+3)²', '(x-3)²'],
        type: 'multiple-choice' as const,
        marks: 10,
        subject: 'Mathematics',
        difficulty: 'Medium'
      },
      {
        id: 'q9',
        question: 'What is log₂(8)?',
        options: ['2', '3', '4', '8'],
        type: 'multiple-choice' as const,
        marks: 10,
        subject: 'Mathematics',
        difficulty: 'Medium'
      },
      {
        id: 'q10',
        question: 'Is every rational number also a real number?',
        options: ['True', 'False'],
        type: 'true-false' as const,
        marks: 10,
        subject: 'Mathematics',
        difficulty: 'Easy'
      }
    ]
  };
};

export const submitExam = async (examId: string, answers: Record<string, string>) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock result calculation
  const correctAnswers = ['2x + 3', 'x = 4', '25π', 'True', '1', '4x²', '3', '(x+3)(x-3)', '3', 'True'];
  let score = 0;
  let correct = 0;
  
  Object.entries(answers).forEach(([questionId, answer], index) => {
    if (answer === correctAnswers[index]) {
      score += 10;
      correct += 1;
    }
  });
  
  return {
    id: `result_${Date.now()}`,
    examId,
    score,
    totalMarks: 100,
    correctAnswers: correct,
    totalQuestions: 10,
    percentage: score,
    status: score >= 60 ? 'Passed' : 'Failed'
  };
};