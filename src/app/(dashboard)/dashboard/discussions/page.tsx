"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";

interface CourseWithDiscussions {
  id: string;
  course: { id: string; title: string };
}

export default function DiscussionsPage() {
  const [enrollments, setEnrollments] = useState<CourseWithDiscussions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/enrollments")
      .then((r) => r.json())
      .then((data) => setEnrollments(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Discussions</h1>
        <p className="text-sm text-gray-500">Join course discussions with instructors and students.</p>
      </div>
      {enrollments.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 font-semibold text-gray-900">No courses enrolled</h3>
          <p className="mt-1 text-sm text-gray-500">Enroll in a course to join its discussion forum.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {enrollments.map((e) => (
            <Link key={e.course.id} href={`/dashboard/discussions/${e.course.id}`}>
              <Card className="transition-shadow hover:shadow-md mb-3">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium text-gray-900">{e.course.title}</h3>
                  </div>
                  <Button variant="outline" size="sm">View Discussions</Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
