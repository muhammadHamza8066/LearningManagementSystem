"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  Video,
  FileText,
  Eye,
  Loader2,
  ChevronDown,
  ChevronRight,
  Globe,
  Lock,
  Save,
  Rocket,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { QuizBuilder } from "@/components/courses/quiz-builder";

interface Lesson {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  isFree: boolean;
  position: number;
}

interface Module {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description?: string;
  status: string;
  slug: string;
}

export default function CourseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [addingModule, setAddingModule] = useState(false);

  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonContent, setNewLessonContent] = useState("");
  const [newLessonVideo, setNewLessonVideo] = useState("");
  const [newLessonFree, setNewLessonFree] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);

  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  const [quizBuilderModuleId, setQuizBuilderModuleId] = useState<string | null>(null);
  const [moduleQuizzes, setModuleQuizzes] = useState<Record<string, any>>({});

  const fetchCourse = useCallback(async () => {
    try {
      const [courseRes, modulesRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/modules`),
      ]);
      const courseData = await courseRes.json();
      const modulesData = await modulesRes.json();
      setCourse(courseData);
      setModules(Array.isArray(modulesData) ? modulesData : []);
      if (Array.isArray(modulesData) && modulesData.length > 0) {
        setExpandedModules(new Set(modulesData.map((m: Module) => m.id)));
        const quizMap: Record<string, any> = {};
        for (const mod of modulesData) {
          try {
            const qRes = await fetch(`/api/courses/${courseId}/modules/${mod.id}/quiz`);
            const qData = await qRes.json();
            if (qData && qData.id) quizMap[mod.id] = qData;
          } catch {}
        }
        setModuleQuizzes(quizMap);
      }
    } catch (error) {
      console.error("Failed to load course:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  function toggleModule(id: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function addModule() {
    if (!newModuleTitle.trim()) return;
    setAddingModule(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newModuleTitle }),
      });
      const mod = await res.json();
      setModules((prev) => [...prev, mod]);
      setExpandedModules((prev) => new Set([...prev, mod.id]));
      setNewModuleTitle("");
    } catch (error) {
      console.error("Failed to add module:", error);
    } finally {
      setAddingModule(false);
    }
  }

  async function addLesson(moduleId: string) {
    if (!newLessonTitle.trim()) return;
    setSavingLesson(true);
    try {
      const res = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newLessonTitle,
            content: newLessonContent,
            videoUrl: newLessonVideo || undefined,
            isFree: newLessonFree,
          }),
        }
      );
      const lesson = await res.json();
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId ? { ...m, lessons: [...(m.lessons || []), lesson] } : m
        )
      );
      resetLessonForm();
    } catch (error) {
      console.error("Failed to add lesson:", error);
    } finally {
      setSavingLesson(false);
    }
  }

  async function updateLesson(moduleId: string) {
    if (!editingLesson) return;
    setSavingLesson(true);
    try {
      const res = await fetch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: editingLesson.id,
            title: newLessonTitle,
            content: newLessonContent,
            videoUrl: newLessonVideo || undefined,
            isFree: newLessonFree,
          }),
        }
      );
      const updated = await res.json();
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lessons: (m.lessons || []).map((l) =>
                  l.id === updated.id ? updated : l
                ),
              }
            : m
        )
      );
      resetLessonForm();
    } catch (error) {
      console.error("Failed to update lesson:", error);
    } finally {
      setSavingLesson(false);
    }
  }

  async function deleteLesson(moduleId: string, lessonId: string) {
    if (!confirm("Delete this lesson?")) return;
    try {
      await fetch(
        `/api/courses/${courseId}/modules/${moduleId}/lessons?lessonId=${lessonId}`,
        { method: "DELETE" }
      );
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: (m.lessons || []).filter((l) => l.id !== lessonId) }
            : m
        )
      );
    } catch (error) {
      console.error("Failed to delete lesson:", error);
    }
  }

  function startEditLesson(moduleId: string, lesson: Lesson) {
    setEditingLesson(lesson);
    setEditingModuleId(moduleId);
    setAddingLessonTo(moduleId);
    setNewLessonTitle(lesson.title);
    setNewLessonContent(lesson.content || "");
    setNewLessonVideo(lesson.videoUrl || "");
    setNewLessonFree(lesson.isFree);
  }

  function resetLessonForm() {
    setAddingLessonTo(null);
    setEditingLesson(null);
    setEditingModuleId(null);
    setNewLessonTitle("");
    setNewLessonContent("");
    setNewLessonVideo("");
    setNewLessonFree(false);
  }

  async function publishCourse() {
    setPublishing(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/publish`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
      } else {
        setCourse((prev) => (prev ? { ...prev, status: "PUBLISHED" } : prev));
      }
    } catch (error) {
      console.error("Failed to publish:", error);
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20 text-gray-500">Course not found.</div>
    );
  }

  const totalLessons = (modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/instructor">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {course.title}
              </h1>
              <Badge
                variant={
                  course.status === "PUBLISHED" ? "success" : "secondary"
                }
              >
                {course.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              {modules.length} modules, {totalLessons} lessons
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {course.status !== "PUBLISHED" && (
            <Button
              onClick={publishCourse}
              disabled={publishing}
              className="gap-2"
            >
              {publishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Rocket className="h-4 w-4" />
              )}
              Publish
            </Button>
          )}
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {(modules || []).map((mod, modIndex) => (
          <Card key={mod.id || `mod-${modIndex}`}>
            <div
              className="flex cursor-pointer items-center justify-between p-4"
              onClick={() => toggleModule(mod.id)}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="h-5 w-5 text-gray-300" />
                {expandedModules.has(mod.id) ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Module {modIndex + 1}: {mod.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {mod.lessons?.length || 0} lesson{(mod.lessons?.length || 0) !== 1 && "s"}
                  </p>
                </div>
              </div>
            </div>

            {expandedModules.has(mod.id) && (
              <div className="border-t border-gray-100 px-4 pb-4">
                {/* Lesson list */}
                {(mod.lessons?.length || 0) > 0 && (
                  <div className="mt-3 space-y-2">
                    {mod.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-gray-300" />
                          {lesson.videoUrl ? (
                            <Video className="h-4 w-4 text-blue-500" />
                          ) : (
                            <FileText className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-700">
                            {lessonIndex + 1}. {lesson.title}
                          </span>
                          {lesson.isFree ? (
                            <Badge variant="success" className="text-[10px]">
                              <Globe className="mr-1 h-3 w-3" />
                              Free
                            </Badge>
                          ) : (
                            <Lock className="h-3 w-3 text-gray-300" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => startEditLesson(mod.id, lesson)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => deleteLesson(mod.id, lesson.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add/Edit lesson form */}
                {addingLessonTo === mod.id ? (
                  <div className="mt-4 space-y-3 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {editingLesson ? "Edit Lesson" : "New Lesson"}
                    </h4>
                    <Input
                      placeholder="Lesson title"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                    />
                    <textarea
                      className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Lesson content (supports text for now, rich editor coming soon)"
                      value={newLessonContent}
                      onChange={(e) => setNewLessonContent(e.target.value)}
                    />
                    <Input
                      placeholder="Video URL (YouTube, Vimeo, or direct link)"
                      value={newLessonVideo}
                      onChange={(e) => setNewLessonVideo(e.target.value)}
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={newLessonFree}
                        onChange={(e) => setNewLessonFree(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                      />
                      Make this lesson free (preview)
                    </label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          editingLesson
                            ? updateLesson(mod.id)
                            : addLesson(mod.id)
                        }
                        disabled={savingLesson || !newLessonTitle.trim()}
                        className="gap-1"
                      >
                        {savingLesson ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Save className="h-3.5 w-3.5" />
                        )}
                        {editingLesson ? "Update" : "Add"} Lesson
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={resetLessonForm}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 gap-1 text-blue-600 hover:text-blue-700"
                    onClick={() => {
                      resetLessonForm();
                      setAddingLessonTo(mod.id);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add lesson
                  </Button>
                )}

                {/* Quiz section */}
                {quizBuilderModuleId === mod.id ? (
                  <div className="mt-4">
                    <QuizBuilder
                      courseId={courseId}
                      moduleId={mod.id}
                      moduleName={mod.title}
                      existingQuiz={moduleQuizzes[mod.id] || null}
                      onClose={() => setQuizBuilderModuleId(null)}
                      onSaved={() => {
                        setQuizBuilderModuleId(null);
                        fetchCourse();
                      }}
                    />
                  </div>
                ) : moduleQuizzes[mod.id] ? (
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {moduleQuizzes[mod.id].title}
                      </span>
                      <Badge variant="success" className="text-[10px]">
                        {moduleQuizzes[mod.id].questions?.length || 0} questions
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setQuizBuilderModuleId(mod.id)}
                    >
                      Edit Quiz
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 gap-1 text-purple-600 hover:text-purple-700"
                    onClick={() => setQuizBuilderModuleId(mod.id)}
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    Add quiz to this module
                  </Button>
                )}
              </div>
            )}
          </Card>
        ))}

        {/* Add module */}
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="New module title (e.g. Introduction, Getting Started)"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addModule()}
              />
              <Button
                onClick={addModule}
                disabled={addingModule || !newModuleTitle.trim()}
                className="gap-1 shrink-0"
              >
                {addingModule ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add Module
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
