"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Save,
  Loader2,
  ClipboardList,
  CheckCircle2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizBuilderProps {
  courseId: string;
  moduleId: string;
  moduleName: string;
  existingQuiz?: {
    id: string;
    title: string;
    passMark: number;
    questions: {
      id: string;
      text: string;
      type: string;
      points: number;
      options: { id: string; text: string; isCorrect: boolean }[];
    }[];
  } | null;
  onClose: () => void;
  onSaved: () => void;
}

interface QuestionDraft {
  text: string;
  type: "MCQ" | "TRUE_FALSE";
  points: number;
  options: { text: string; isCorrect: boolean }[];
}

const emptyMCQ: QuestionDraft = {
  text: "",
  type: "MCQ",
  points: 1,
  options: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
};

const emptyTF: QuestionDraft = {
  text: "",
  type: "TRUE_FALSE",
  points: 1,
  options: [
    { text: "True", isCorrect: true },
    { text: "False", isCorrect: false },
  ],
};

export function QuizBuilder({
  courseId,
  moduleId,
  moduleName,
  existingQuiz,
  onClose,
  onSaved,
}: QuizBuilderProps) {
  const [title, setTitle] = useState(existingQuiz?.title || `${moduleName} Quiz`);
  const [passMark, setPassMark] = useState(existingQuiz?.passMark || 70);
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    existingQuiz?.questions.map((q) => ({
      text: q.text,
      type: q.type as "MCQ" | "TRUE_FALSE",
      points: q.points,
      options: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
    })) || [{ ...emptyMCQ }]
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  function addQuestion(type: "MCQ" | "TRUE_FALSE") {
    setQuestions((prev) => [
      ...prev,
      type === "MCQ" ? { ...emptyMCQ, options: emptyMCQ.options.map((o) => ({ ...o })) } : { ...emptyTF, options: emptyTF.options.map((o) => ({ ...o })) },
    ]);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateQuestion(index: number, field: string, value: string | number) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  }

  function updateOption(qIndex: number, oIndex: number, field: string, value: string | boolean) {
    setQuestions((prev) =>
      prev.map((q, qi) =>
        qi === qIndex
          ? {
              ...q,
              options: q.options.map((o, oi) => {
                if (field === "isCorrect" && value === true) {
                  return oi === oIndex ? { ...o, isCorrect: true } : { ...o, isCorrect: false };
                }
                return oi === oIndex ? { ...o, [field]: value } : o;
              }),
            }
          : q
      )
    );
  }

  function addOption(qIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: [...q.options, { text: "", isCorrect: false }] } : q
      )
    );
  }

  function removeOption(qIndex: number, oIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: q.options.filter((_, oi) => oi !== oIndex) } : q
      )
    );
  }

  async function handleSave() {
    setError("");

    if (!title.trim()) { setError("Quiz title is required"); return; }
    if (questions.length === 0) { setError("Add at least one question"); return; }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) { setError(`Question ${i + 1} text is empty`); return; }
      const hasCorrect = questions[i].options.some((o) => o.isCorrect);
      if (!hasCorrect) { setError(`Question ${i + 1} needs a correct answer`); return; }
      const emptyOpts = questions[i].options.filter((o) => !o.text.trim());
      if (emptyOpts.length > 0) { setError(`Question ${i + 1} has empty options`); return; }
    }

    setSaving(true);

    try {
      if (existingQuiz) {
        await fetch(`/api/courses/${courseId}/modules/${moduleId}/quiz`, { method: "DELETE" });
      }

      const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, passMark, questions }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save quiz");
        setSaving(false);
        return;
      }

      onSaved();
    } catch {
      setError("Failed to save quiz");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingQuiz || !confirm("Delete this quiz and all its submissions?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/courses/${courseId}/modules/${moduleId}/quiz`, { method: "DELETE" });
      onSaved();
    } catch {
      setError("Failed to delete quiz");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5 rounded-xl border-2 border-blue-200 bg-blue-50/30 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-blue-600" />
          Quiz Builder
        </h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Quiz Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Pass Mark (%)</label>
          <Input
            type="number"
            min={0}
            max={100}
            value={passMark}
            onChange={(e) => setPassMark(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={qi} className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Q{qi + 1}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {q.type === "MCQ" ? "Multiple Choice" : "True/False"}
                </Badge>
                <span className="text-xs text-gray-400">{q.points} pt</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-500 hover:text-red-700"
                onClick={() => removeQuestion(qi)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <Input
              placeholder="Enter your question..."
              value={q.text}
              onChange={(e) => updateQuestion(qi, "text", e.target.value)}
            />

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500">
                Options (click radio to mark correct answer)
              </label>
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateOption(qi, oi, "isCorrect", true)}
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      opt.isCorrect
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300 hover:border-gray-400"
                    )}
                  >
                    {opt.isCorrect && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </button>
                  <Input
                    placeholder={`Option ${oi + 1}`}
                    value={opt.text}
                    onChange={(e) => updateOption(qi, oi, "text", e.target.value)}
                    className="flex-1"
                    disabled={q.type === "TRUE_FALSE"}
                  />
                  {q.type === "MCQ" && q.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400"
                      onClick={() => removeOption(qi, oi)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              {q.type === "MCQ" && q.options.length < 6 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600"
                  onClick={() => addOption(qi)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add option
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add question buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => addQuestion("MCQ")} className="gap-1">
          <Plus className="h-3.5 w-3.5" />
          Add MCQ
        </Button>
        <Button variant="outline" size="sm" onClick={() => addQuestion("TRUE_FALSE")} className="gap-1">
          <Plus className="h-3.5 w-3.5" />
          Add True/False
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div>
          {existingQuiz && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="gap-1"
            >
              {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Delete Quiz
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
