"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Video,
  FileText,
  ChevronDown,
  ChevronRight,
  Loader2,
  BookOpen,
  ClipboardList,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  content?: string;
  duration?: number;
  isFree: boolean;
  position: number;
}

interface Module {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
  quiz?: { id: string; title: string } | null;
}

interface CourseData {
  id: string;
  title: string;
  modules: Module[];
  instructor: { name: string };
}

interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
}

export default function CourseLearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseData | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/progress`),
      ]);
      const courseData = await courseRes.json();
      const progressData = await progressRes.json();

      setCourse(courseData);
      setProgress(progressData.lessonProgress || []);
      setOverallProgress(progressData.progress || 0);

      if (courseData.modules?.length > 0) {
        setExpandedModules(new Set(courseData.modules.map((m: Module) => m.id)));
        const firstIncomplete = findFirstIncompleteLesson(
          courseData.modules,
          progressData.lessonProgress || []
        );
        if (firstIncomplete) {
          setActiveLesson(firstIncomplete.lesson);
          setActiveModuleId(firstIncomplete.moduleId);
        } else if (courseData.modules[0]?.lessons?.[0]) {
          setActiveLesson(courseData.modules[0].lessons[0]);
          setActiveModuleId(courseData.modules[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load course:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function findFirstIncompleteLesson(
    modules: Module[],
    lessonProgress: LessonProgress[]
  ) {
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        const lp = lessonProgress.find((p) => p.lessonId === lesson.id);
        if (!lp?.isCompleted) {
          return { lesson, moduleId: mod.id };
        }
      }
    }
    return null;
  }

  function isLessonCompleted(lessonId: string) {
    return progress.some((p) => p.lessonId === lessonId && p.isCompleted);
  }

  async function markComplete() {
    if (!activeLesson) return;
    setCompleting(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: activeLesson.id }),
      });
      const data = await res.json();
      setOverallProgress(data.progress);
      setProgress((prev) => [
        ...prev.filter((p) => p.lessonId !== activeLesson.id),
        { lessonId: activeLesson.id, isCompleted: true },
      ]);

      if (course) {
        const nextLesson = findNextLesson(course.modules || [], activeLesson.id);
        if (nextLesson) {
          setActiveLesson(nextLesson.lesson);
          setActiveModuleId(nextLesson.moduleId);
        }
      }
    } catch (error) {
      console.error("Failed to mark complete:", error);
    } finally {
      setCompleting(false);
    }
  }

  function findNextLesson(modules: Module[], currentLessonId: string) {
    const allLessons: { lesson: Lesson; moduleId: string }[] = [];
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        allLessons.push({ lesson, moduleId: mod.id });
      }
    }
    const currentIndex = allLessons.findIndex((l) => l.lesson.id === currentLessonId);
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    return null;
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
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!course) {
    return <div className="py-20 text-center text-gray-500">Course not found.</div>;
  }

  const totalLessons = (course?.modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const completedCount = (progress || []).filter((p) => p.isCompleted).length;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar - Curriculum */}
      <div className="w-80 shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4">
          <Link href="/dashboard/my-courses" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-3">
            <ArrowLeft className="h-4 w-4" />
            Back to my courses
          </Link>
          <h2 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h2>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{completedCount}/{totalLessons} lessons</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-2">
          {(course?.modules || []).map((mod, i) => (
            <div key={mod.id} className="mb-1">
              <button
                onClick={() => toggleModule(mod.id)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {expandedModules.has(mod.id) ? (
                  <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                )}
                <span className="line-clamp-1">Module {i + 1}: {mod.title}</span>
              </button>

              {expandedModules.has(mod.id) && (
                <div className="ml-2 space-y-0.5">
                  {(mod.lessons || []).map((lesson) => {
                    const completed = isLessonCompleted(lesson.id);
                    const isActive = activeLesson?.id === lesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setActiveLesson(lesson);
                          setActiveModuleId(mod.id);
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {completed ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-gray-300" />
                        )}
                        <span className="line-clamp-1">{lesson.title}</span>
                        {lesson.videoUrl && (
                          <Video className="ml-auto h-3.5 w-3.5 shrink-0 text-gray-300" />
                        )}
                      </button>
                    );
                  })}
                  {mod.quiz && (
                    <Link
                      href={`/dashboard/my-courses/${courseId}/quiz/${mod.quiz.id}`}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-purple-600 hover:bg-purple-50 transition-colors"
                    >
                      <ClipboardList className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-1">{mod.quiz.title}</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {activeLesson ? (
          <div className="mx-auto max-w-4xl p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{activeLesson.title}</h1>
                {activeLesson.duration && (
                  <p className="mt-1 text-sm text-gray-500">{activeLesson.duration} min</p>
                )}
              </div>
              {!isLessonCompleted(activeLesson.id) ? (
                <Button onClick={markComplete} disabled={completing} className="gap-2">
                  {completing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Mark as complete
                </Button>
              ) : (
                <Badge variant="success" className="gap-1 py-1.5 px-3">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Completed
                </Badge>
              )}
            </div>

            {activeLesson.videoUrl && (
              <div className="mb-8 aspect-video overflow-hidden rounded-xl bg-black">
                <iframe
                  src={activeLesson.videoUrl.replace("watch?v=", "embed/")}
                  className="h-full w-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}

            {activeLesson.content && (
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {activeLesson.content}
                </div>
              </div>
            )}

            {!activeLesson.videoUrl && !activeLesson.content && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FileText className="h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">No content added to this lesson yet.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">Select a lesson to start learning.</p>
          </div>
        )}
      </div>
    </div>
  );
}
