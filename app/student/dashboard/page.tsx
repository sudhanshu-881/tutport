"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar';
import { BookOpen, Clock, Award, TrendingUp, Play, Eye, Calendar } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { getStudentDashboardData } from '@/lib/student';
import { useRouter } from 'next/navigation';

interface DashboardData {
  student: {
    name: string;
    email: string;
    studentId: string;
    grade: string;
  };
  availableExams: Array<{
    id: string;
    title: string;
    duration: number;
    totalQuestions: number;
    subject: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
  }>;
  recentResults: Array<{
    id: string;
    examTitle: string;
    score: number;
    totalMarks: number;
    percentage: number;
    completedAt: string;
    status: 'Passed' | 'Failed';
  }>;
  stats: {
    totalExamsTaken: number;
    averageScore: number;
    bestScore: number;
    totalHours: number;
  };
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashboardData = await getStudentDashboardData();
      setData(dashboardData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startExam = (examId: string) => {
    router.push(`/student/exam/${examId}`);
  };

  const viewResults = (resultId: string) => {
    router.push(`/student/results/${resultId}`);
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {data.student.name}!
                </h1>
                <p className="text-blue-100 text-lg">
                  {data.student.grade} | Student ID: {data.student.studentId}
                </p>
              </div>
              <Avatar className="h-16 w-16 bg-white/20">
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {data.student.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Exams Taken</p>
                  <p className="text-3xl font-bold">{data.stats.totalExamsTaken}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Average Score</p>
                  <p className="text-3xl font-bold">{data.stats.averageScore}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Best Score</p>
                  <p className="text-3xl font-bold">{data.stats.bestScore}%</p>
                </div>
                <Award className="h-8 w-8 text-purple-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Study Hours</p>
                  <p className="text-3xl font-bold">{data.stats.totalHours}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-green-600" />
                Available Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.availableExams.map((exam) => (
                  <div key={exam.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{exam.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        exam.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        exam.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {exam.difficulty}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {exam.subject}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {exam.duration} mins
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {exam.totalQuestions} questions
                      </span>
                      <Button 
                        onClick={() => startExam(exam.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Start Exam
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Recent Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{result.examTitle}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        result.status === 'Passed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Score: {result.score}/{result.totalMarks}</span>
                        <span className="font-semibold">{result.percentage}%</span>
                      </div>
                      <Progress value={result.percentage} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {new Date(result.completedAt).toLocaleDateString()}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewResults(result.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
