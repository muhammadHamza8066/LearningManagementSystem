"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader2, CheckCircle2 } from "lucide-react";
import { CourseThumbnail } from "@/components/courses/course-thumbnail";

interface EnrolledCourse {
  id: string;
  progress: number;
  status: string;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string;
    instructor: { name: string };
    modules: { lessons: { id: string }[] }[];
  };
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/enrollments")
      .then((r) => r.json())
      .then(setEnrollments)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-sm text-gray-500">Continue learning where you left off.</p>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 font-semibold text-gray-900">No courses yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Browse the catalog and enroll in your first course.
            </p>
            <Link
              href="/courses"
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Browse courses
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => {
            const totalLessons = enrollment.course.modules.reduce(
              (acc, m) => acc + m.lessons.length,
              0
            );

            return (
              <Link
                key={enrollment.id}
                href={`/dashboard/my-courses/${enrollment.course.id}`}
              >
                <Card className="h-full transition-shadow hover:shadow-md">
                  <div className="relative">
                    <CourseThumbnail title={enrollment.course.title} thumbnail={enrollment.course.thumbnail} className="aspect-video rounded-t-xl" />
                    {enrollment.status === "COMPLETED" && (
                      <Badge className="absolute right-3 top-3 bg-green-600 text-white">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {enrollment.course.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      by {enrollment.course.instructor.name}
                    </p>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                        <span>{Math.round(enrollment.progress)}% complete</span>
                        <span>{totalLessons} lessons</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
