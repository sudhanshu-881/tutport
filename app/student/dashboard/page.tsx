"use client";

import React, { useEffect, useState } from "react";

// Define interfaces for your data structures
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

// Mock your data fetching function here (replace with actual API call)
async function getStudentDashboardData(): Promise<DashboardData> {
  // Simulated fetch delay
  await new Promise((res) => setTimeout(res, 500));

  // Example static data, replace with real API data
  return {
    student: {
      name: "John Doe",
      email: "john@example.com",
      studentId: "S123456",
      grade: "10th Grade",
    },
    availableExams: [
      {
        id: "1",
        title: "Math Exam",
        duration: 60,
        totalQuestions: 50,
        subject: "Mathematics",
        difficulty: "Hard",
      },
      {
        id: "2",
        title: "Science Exam",
        duration: 45,
        totalQuestions: 40,
        subject: "Science",
        difficulty: "Medium",
      },
    ],
    recentResults: [
      {
        id: "r1",
        examTitle: "English Exam",
        status: "Passed",
        date: "2024-08-01",
        duration: 50,
        score: 85,
      },
      {
        id: "r2",
        examTitle: "History Exam",
        status: "Failed",
        date: "2024-07-20",
        duration: 40,
        score: 55,
      },
    ],
    stats: {
      totalExams: 10,
      examsTaken: 7,
      examsPassed: 5,
      averageScore: 78,
    },
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const dashboardData = await getStudentDashboardData();
        setData(dashboardData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No dashboard data available.</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {data.student.name}!
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Your Stats</h2>
        <ul>
          <li>Total Exams: {data.stats.totalExams}</li>
          <li>Exams Taken: {data.stats.examsTaken}</li>
          <li>Exams Passed: {data.stats.examsPassed}</li>
          <li>Average Score: {data.stats.averageScore}%</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Available Exams</h2>
        <ul>
          {data.availableExams.map((exam) => (
            <li key={exam.id} className="mb-2">
              <strong>{exam.title}</strong> - {exam.subject} ({exam.difficulty}) - Duration: {exam.duration} mins - Questions: {exam.totalQuestions}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Recent Results</h2>
        <ul>
          {data.recentResults.map((result) => (
            <li key={result.id} className="mb-2">
              <strong>{result.examTitle}</strong> - Status: {result.status} - Score: {result.score}% - Date: {result.date}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
