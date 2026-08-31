"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Star,
  Clock,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  Globe,
  Lock,
  CheckCircle2,
  Loader2,
  Play,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CourseDetail {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  price: number;
  isFree: boolean;
  level?: string;
  status: string;
  instructor: { id: string; name: string; image?: string; bio?: string };
  category?: { name: string };
  modules: {
    id: string;
    title: string;
    position: number;
    lessons: {
      id: string;
      title: string;
      duration?: number;
      isFree: boolean;
      videoUrl?: string;
    }[];
  }[];
  _count: { enrollments: number; reviews: number };
  reviews: {
    rating: number;
    comment?: string;
    user: { name: string; image?: string };
  }[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params.slug as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetch(`/api/courses/by-slug/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setCourse(data);
        if (data.modules?.length > 0) {
          setExpandedModules(new Set([data.modules[0].id]));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (course && session) {
      fetch(`/api/courses/${course.id}/enrollment-status`)
        .then((r) => r.json())
        .then((data) => setEnrolled(data.enrolled))
        .catch(() => {});
    }
  }, [course, session]);

  async function handleEnroll() {
    if (!session) {
      router.push("/login");
      return;
    }
    if (!course) return;

    setEnrolling(true);
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, {
        method: "POST",
      });
      if (res.ok) {
        setEnrolled(true);
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch {
      alert("Failed to enroll. Please try again.");
    } finally {
      setEnrolling(false);
    }
  }

  function toggleModule(id: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <PublicNavbar />
        <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
      </div>
    );
  }

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );
  const avgRating =
    course.reviews.length > 0
      ? course.reviews.reduce((acc, r) => acc + r.rating, 0) /
        course.reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero */}
      <div className="bg-gray-900 pt-16">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {course.category && (
                <Badge className="mb-4 bg-blue-600 text-white">
                  {course.category.name}
                </Badge>
              )}
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                {course.title}
              </h1>
              <p className="mt-4 text-lg text-gray-300">
                {course.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {avgRating > 0 && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400" />
                    {avgRating.toFixed(1)} ({course._count.reviews} reviews)
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {course._count.enrollments} students
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {totalLessons} lessons
                </span>
                {course.level && (
                  <span className="flex items-center gap-1">
                    {course.level}
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Created by{" "}
                <span className="text-white">{course.instructor.name}</span>
              </p>
            </div>

            {/* Enroll card */}
            <div className="lg:row-start-1">
              <div className="sticky top-24 rounded-xl border border-gray-700 bg-gray-800 p-6">
                <div className="mb-4 aspect-video rounded-lg bg-gray-700 flex items-center justify-center">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <Play className="h-12 w-12 text-gray-500" />
                  )}
                </div>

                <div className="mb-4 text-3xl font-extrabold text-white">
                  {course.isFree ? "Free" : formatPrice(course.price)}
                </div>

                {enrolled ? (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => router.push(`/dashboard/my-courses`)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Go to course
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {course.isFree ? "Enroll for free" : "Buy now"}
                  </Button>
                )}

                <ul className="mt-6 space-y-2.5 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    {totalLessons} lessons
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    {course.modules.length} modules
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    Certificate on completion
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    Full lifetime access
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="lg:pr-96">
          <h2 className="text-2xl font-bold text-gray-900">
            Course Curriculum
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {course.modules.length} modules, {totalLessons} lessons
          </p>

          <div className="mt-8 space-y-3">
            {course.modules.map((mod, i) => (
              <div
                key={mod.id}
                className="overflow-hidden rounded-xl border border-gray-200"
              >
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="flex w-full items-center justify-between bg-gray-50 px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    {expandedModules.has(mod.id) ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm font-semibold text-gray-900">
                      Module {i + 1}: {mod.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {mod.lessons.length} lessons
                  </span>
                </button>

                {expandedModules.has(mod.id) && (
                  <div className="divide-y divide-gray-100 bg-white">
                    {mod.lessons.map((lesson, j) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between px-5 py-3"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.videoUrl ? (
                            <Video className="h-4 w-4 text-blue-500" />
                          ) : (
                            <FileText className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-700">
                            {j + 1}. {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {lesson.isFree ? (
                            <Badge
                              variant="success"
                              className="text-[10px]"
                            >
                              Preview
                            </Badge>
                          ) : (
                            <Lock className="h-3.5 w-3.5 text-gray-300" />
                          )}
                          {lesson.duration && (
                            <span className="text-xs text-gray-400">
                              {lesson.duration}m
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Instructor */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900">Instructor</h2>
            <div className="mt-6 flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                {course.instructor.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {course.instructor.name}
                </h3>
                {course.instructor.bio && (
                  <p className="mt-1 text-sm text-gray-500">
                    {course.instructor.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Reviews */}
          {course.reviews.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
              <div className="mt-6 space-y-4">
                {course.reviews.map((review, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-200 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                        {review.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {review.user.name}
                        </p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`h-3.5 w-3.5 ${
                                j < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-3 text-sm text-gray-600">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
