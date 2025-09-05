"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ... your imports here

interface Student {
  name: string;
  email: string;
  studentId: string;
  grade: string;
}

interface Exam {
  id: string;
  title: string;
  duration: number;
  totalQuestions: number;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface Result {
  id: string;
  examTitle: string;
  status: string;
  date: string;
  duration: number;
  score: number;
}

interface Stats {
  totalExams: number;
  examsTaken: number;
  examsPassed: number;
  averageScore: number;
}

interface DashboardData {
  student: Student;
  availableExams: Exam[];
  recentResults: Result[];
  stats: Stats;
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const dashboardData: DashboardData = await getStudentDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

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

  const startExam = (examId: string) => {
    router.push(`/student/exam/${examId}`);
  };

  const viewResults = (resultId: string) => {
    router.push(`/student/results/${resultId}`);
  };

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
                <AvatarFallback>
                  {data.student.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Exams</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-2">
              <BookOpen />
              <span>{data.stats.totalExams}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exams Taken</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-2">
              <Clock />
              <span>{data.stats.examsTaken}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exams Passed</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-2">
              <Award />
              <span>{data.stats.examsPassed}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Score</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center space-x-2">
              <TrendingUp />
              <span>{data.stats.averageScore}%</span>
            </CardContent>
          </Card>
        </div>

        {/* Ongoing Exams */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ongoing Exams</h2>
          {data.ongoingExams.length === 0 ? (
            <p>No ongoing exams at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.ongoingExams.map((exam) => (
                <Card key={exam.id}>
                  <CardHeader>
                    <CardTitle>{exam.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">{exam.description}</p>
                    <Progress value={exam.progress} className="mb-4" />
                    <div className="flex space-x-4 text-gray-600">
                      <Clock className="inline-block" />
                      <span>{exam.duration} minutes</span>
                      <Play className="inline-block" />
                      <span>{exam.questions} questions</span>
                    </div>
                    <Button
                      className="mt-4"
                      onClick={() => startExam(exam.id)}
                      variant="default"
                    >
                      Continue Exam
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Results</h2>
          {data.recentResults.length === 0 ? (
            <p>No recent results to show.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.recentResults.map((result) => (
                <Card key={result.id}>
                  <CardHeader>
                    <CardTitle>{result.examTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Eye />
                        <span>{result.status}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Calendar />
                        <span>{new Date(result.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock />
                        <span>{result.duration} minutes</span>
                      </div>
                    </div>
                    <p className="mb-4">Score: {result.score}%</p>
                    <Button
                      variant="outline"
                      onClick={() => viewResults(result.id)}
                    >
                      View Result
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
