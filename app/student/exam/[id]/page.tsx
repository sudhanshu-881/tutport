"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { getExamData, submitExam } from '@/lib/exam';
import { toast } from 'sonner';

interface Question {
  id: string;
  question: string;
  options: string[];
  type: 'multiple-choice' | 'true-false';
  marks: number;
  subject: string;
  difficulty: string;
}

interface ExamData {
  id: string;
  title: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  instructions: string[];
  questions: Question[];
}

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

  // Use ref to track if submitting to avoid stale closure issues in callbacks
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    loadExamData();
  }, [examId]);

  const loadExamData = async () => {
    try {
      const data = await getExamData(examId);
      setExamData(data);
      setTimeRemaining(data.duration * 60); // Convert minutes to seconds
    } catch (error) {
      toast.error('Failed to load exam data');
      router.push('/student/dashboard');
    }
  };

  // useCallback so can safely depend on it in timer effect
  const handleSubmitExam = useCallback(async () => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const result = await submitExam(examId, answers);
      toast.success('Exam submitted successfully!');
      router.push(`/student/results/${result.id}`);
    } catch (error) {
      toast.error('Failed to submit exam');
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  }, [examId, answers, router]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, handleSubmitExam]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const toggleFlag = (questionIndex: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!examData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  // Safety check: prevent error if questions array empty or currentQuestion invalid
  if (!examData.questions.length || currentQuestion < 0 || currentQuestion >= examData.questions.length) {
    return <p className="text-center mt-20 text-red-600">Invalid question index.</p>;
  }

  const currentQ = examData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / examData.totalQuestions) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Exam Header */}
        <Card className="mb-6 border-l-4 border-l-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{examData.title}</h1>
                <p className="text-gray-600 mt-1">
                  Question {currentQuestion + 1} of {examData.totalQuestions} •
                  {answeredQuestions} answered •
                  {flaggedQuestions.size} flagged
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    timeRemaining < 300 ? 'bg-red-100 text-red-800' :
                    timeRemaining < 600 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}
                >
                  <Clock className="h-5 w-5" />
                  <span className="font-mono text-lg font-semibold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>

                <Button
                  onClick={handleSubmitExam}
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                </Button>
              </div>
            </div>

            <Progress value={progress} className="mt-4 h-2" />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {currentQuestion + 1}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({currentQ.marks} {currentQ.marks === 1 ? 'mark' : 'marks'})
                    </span>
                  </CardTitle>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFlag(currentQuestion)}
                    className={flaggedQuestions.has(currentQuestion) ? 'text-red-600 border-red-600' : ''}
                  >
                    <Flag className={`h-4 w-4 ${flaggedQuestions.has(currentQuestion) ? 'fill-current' : ''}`} />
                    {flaggedQuestions.has(currentQuestion) ? 'Flagged' : 'Flag'}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-lg leading-relaxed">
                  {currentQ.question}
                </div>

                <RadioGroup
                  value={answers[currentQ.id] || ''}
                  onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                  className="space-y-3"
                >
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer text-base"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="text-sm text-gray-500">
                    Subject: {currentQ.subject} • Difficulty: {currentQ.difficulty}
                  </div>

                  <Button
                    onClick={() => setCurrentQuestion(prev => Math.min(examData.questions.length - 1, prev + 1))}
                    disabled={currentQuestion === examData.questions.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Navigation */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {examData.questions.map((_, index) => {
                    const isAnswered = answers[examData.questions[index].id];
                    const isFlagged = flaggedQuestions.has(index);
                    const isCurrent = index === currentQuestion;

                    return (
                      <Button
                        key={index}
                        variant={isCurrent ? 'default' : 'outline'}
                        size="sm"
                        className={`relative h-10 w-10 p-0 ${
                          isAnswered && !isCurrent ? 'bg-green-100 border-green-500 text-green-800' : ''
                        } ${
                          isFlagged ? 'ring-2 ring-red-400' : ''
                        }`}
                        onClick={() => setCurrentQuestion(index)}
                      >
                        {index + 1}
                        {isFlagged && (
                          <Flag className="absolute -top-1 -right-1 h-3 w-3 fill-red-500 text-red-500" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Exam Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Questions:</span>
                    <span className="font-semibold">{examData.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Answered:</span>
                    <span className="font-semibold text-green-600">{answeredQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining:</span>
                    <span className="font-semibold text-orange-600">
                      {examData.totalQuestions - answeredQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flagged:</span>
                    <span className="font-semibold text-red-600">{flaggedQuestions.size}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={handleSubmitExam}
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
