"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Target, 
  TrendingUp, 
  Calendar,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { getExamResult } from '@/lib/results';

interface ExamResult {
  id: string;
  examTitle: string;
  studentName: string;
  completedAt: string;
  duration: number;
  timeTaken: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  status: 'Passed' | 'Failed';
  subjectWisePerformance: Array<{
    subject: string;
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
  }>;
  questionResults: Array<{
    questionId: string;
    question: string;
    correctAnswer: string;
    studentAnswer: string;
    isCorrect: boolean;
    marks: number;
    obtainedMarks: number;
    explanation?: string;
  }>;
  recommendations: string[];
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const resultId = params.id as string;

  const [result, setResult] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'analysis'>('overview');

  useEffect(() => {
    loadExamResult();
  }, [resultId]);

  const loadExamResult = async () => {
    try {
      const data = await getExamResult(resultId);
      setResult(data);
    } catch (error) {
      console.error('Failed to load exam result:', error);
      router.push('/student/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/student/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{result.examTitle}</h1>
                <p className="text-gray-600 mt-1">
                  Completed on {new Date(result.completedAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Result Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={`border-l-4 ${result.status === 'Passed' ? 'border-l-green-500 bg-green-50' : 'border-l-red-500 bg-red-50'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Result</p>
                  <p className="text-2xl font-bold">{result.percentage}%</p>
                  <Badge variant={result.status === 'Passed' ? 'default' : 'destructive'} className="mt-2">
                    {result.status}
                  </Badge>
                </div>
                <Award className={`h-8 w-8 ${result.status === 'Passed' ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="text-2xl font-bold">{result.obtainedMarks}/{result.totalMarks}</p>
                  <p className="text-sm text-gray-500 mt-1">Grade: {result.grade}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold">{Math.round((result.correctAnswers / result.totalQuestions) * 100)}%</p>
                  <p className="text-sm text-gray-500 mt-1">{result.correctAnswers}/{result.totalQuestions} correct</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Time Taken</p>
                  <p className="text-2xl font-bold">{formatDuration(result.timeTaken)}</p>
                  <p className="text-sm text-gray-500 mt-1">of {formatDuration(result.duration)}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'detailed', label: 'Detailed Results', icon: CheckCircle },
                { id: 'analysis', label: 'Performance Analysis', icon: Award }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {result.subjectWisePerformance.map((subject) => (
                    <div key={subject.subject}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{subject.subject}</span>
                        <span className="text-sm text-gray-600">
                          {subject.correctAnswers}/{subject.totalQuestions} ({subject.percentage}%)
                        </span>
                      </div>
                      <Progress value={subject.percentage} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">Correct Answers</p>
                        <p className="text-sm text-green-600">Well done!</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-green-800">{result.correctAnswers}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-8 w-8 text-red-600" />
                      <div>
                        <p className="font-semibold text-red-800">Incorrect Answers</p>
                        <p className="text-sm text-red-600">Review these topics</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-red-800">{result.incorrectAnswers}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-8 w-8 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-800">Skipped Questions</p>
                        <p className="text-sm text-gray-600">Consider attempting all</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{result.skippedQuestions}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'detailed' && (
          <Card>
            <CardHeader>
              <CardTitle>Question-by-Question Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {result.questionResults.map((question, index) => (
                  <div key={question.questionId} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            Q{index + 1}
                          </span>
                          {question.isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="text-sm text-gray-600">
                            {question.obtainedMarks}/{question.marks} marks
                          </span>
                        </div>
                        <p className="text-lg font-medium mb-3">{question.question}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Your Answer:</p>
                        <p className={`p-3 rounded-lg ${
                          question.isCorrect 
                            ? 'bg-green-50 text-green-800 border border-green-200' 
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                          {question.studentAnswer || 'Not answered'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Correct Answer:</p>
                        <p className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-lg">
                          {question.correctAnswer}
                        </p>
                      </div>
                    </div>

                    {question.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-800 mb-2">Explanation:</p>
                        <p className="text-sm text-blue-700">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analysis' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recommendations for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-800">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule a retake exam
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <Award className="h-4 w-4 mr-2" />
                    View similar practice tests
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Access study materials
                  </Button>
                  
                  <Button className="w-full justify-start" variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share results with instructor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}