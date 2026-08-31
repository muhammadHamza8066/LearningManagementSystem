"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Pencil,
  Users,
  BookOpen,
  Loader2,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  price: number;
  isFree: boolean;
  createdAt: string;
  _count: { enrollments: number; modules: number };
}

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instructor/courses")
      .then((r) => r.json())
      .then((data) => setCourses(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function deleteCourse(id: string) {
    if (!confirm("Delete this course and all its content?")) return;
    try {
      await fetch(`/api/courses/${id}`, { method: "DELETE" });
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-sm text-gray-500">
            Manage your courses, modules, and lessons.
          </p>
        </div>
        <Link href="/instructor/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <BookOpen className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">
              No courses yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first course to get started.
            </p>
            <Link href="/instructor/create" className="mt-4">
              <Button size="sm" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create course
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {course.title}
                    </h3>
                    <Badge
                      variant={
                        course.status === "PUBLISHED"
                          ? "success"
                          : course.status === "DRAFT"
                            ? "secondary"
                            : "warning"
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                  <div className="mt-1.5 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course._count.enrollments} students
                    </span>
                    <span>
                      {course.isFree ? "Free" : formatPrice(course.price)}
                    </span>
                    <span>Created {formatDate(course.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/instructor/courses/${course.id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    onClick={() => deleteCourse(course.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
