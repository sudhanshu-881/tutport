import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // in pages dir, next/navigation is for app dir

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen, Clock, Award, TrendingUp, Play, Eye, Calendar } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { getStudentDashboardData } from '@/lib/student';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const dashboardData = await getStudentDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const startExam = (examId) => {
    router.push(`/student/exam/${examId}`);
  };

  const viewResults = (resultId) => {
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
                <h1 className="text-3xl font-bold mb-2">Welcome back, {data.student.name}!</h1>
                <p className="text-blue-100 text-lg">
                  {data.student.grade} | Student ID: {data.student.studentId}
                </p>
              </div>
              <Avatar className="h-16 w-16 bg-white/20">
                <AvatarFallback>
                  {data.student.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        {/* ... rest unchanged */}
      </main>
    </div>
  );
}
