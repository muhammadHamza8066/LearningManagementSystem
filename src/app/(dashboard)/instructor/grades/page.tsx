"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ClipboardList, CheckCircle2, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Submission {
  id: string;
  score: number | null;
  status: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
}

interface Quiz {
  id: string;
  title: string;
  passMark: number;
  submissions: Submission[];
}

interface ModuleWithQuiz {
  id: string;
  title: string;
  quiz: Quiz | null;
}

interface CourseGrades {
  id: string;
  title: string;
  modules: ModuleWithQuiz[];
}

export default function GradeBookPage() {
  const [courses, setCourses] = useState<CourseGrades[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instructor/grades")
      .then((r) => r.json())
      .then(setCourses)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const allQuizzes = courses.flatMap((c) =>
    c.modules
      .filter((m) => m.quiz)
      .map((m) => ({
        courseName: c.title,
        moduleName: m.title,
        quiz: m.quiz!,
      }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grade Book</h1>
        <p className="text-sm text-gray-500">View all quiz submissions from your students.</p>
      </div>

      {allQuizzes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 font-semibold text-gray-900">No quizzes yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create quizzes in your courses to see student grades here.
            </p>
          </CardContent>
        </Card>
      ) : (
        allQuizzes.map(({ courseName, moduleName, quiz }) => (
          <Card key={quiz.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{quiz.title}</CardTitle>
                  <p className="mt-1 text-xs text-gray-500">
                    {courseName} / {moduleName} / Pass mark: {quiz.passMark}%
                  </p>
                </div>
                <Badge variant="secondary">
                  {quiz.submissions.length} submission{quiz.submissions.length !== 1 && "s"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {quiz.submissions.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-400">
                  No submissions yet.
                </p>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Student</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Score</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {quiz.submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">{sub.user.name}</p>
                              <p className="text-xs text-gray-500">{sub.user.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-sm font-semibold ${
                                (sub.score || 0) >= quiz.passMark
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {sub.score?.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {(sub.score || 0) >= quiz.passMark ? (
                              <Badge variant="success" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Passed
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="gap-1">
                                <XCircle className="h-3 w-3" />
                                Failed
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {formatDate(sub.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
