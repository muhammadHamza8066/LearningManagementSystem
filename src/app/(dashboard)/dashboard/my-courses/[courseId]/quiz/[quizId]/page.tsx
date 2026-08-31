"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  type: string;
  points: number;
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  passMark: number;
  timeLimit?: number;
  questions: Question[];
}

interface QuizResult {
  score: number;
  passed: boolean;
  passMark: number;
  totalQuestions: number;
  correctAnswers: number;
}

export default function QuizTakePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/quiz/${quizId}`)
      .then((r) => r.json())
      .then((data) => {
        setQuiz(data);
        if (data?.timeLimit) setTimeLeft(data.timeLimit * 60);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev !== null && prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

  function selectAnswer(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  async function handleSubmit() {
    if (!quiz) return;
    setSubmitting(true);

    const moduleId = quiz.id;
    const answerPayload = quiz.questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: answers[q.id] || undefined,
    }));

    try {
      const res = await fetch(`/api/quiz/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answerPayload }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    } finally {
      setSubmitting(false);
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!quiz) {
    return <div className="py-20 text-center text-gray-500">Quiz not found.</div>;
  }

  if (result) {
    return (
      <div className="mx-auto max-w-xl py-12">
        <Card>
          <CardContent className="p-8 text-center">
            <div
              className={cn(
                "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full",
                result.passed ? "bg-green-50" : "bg-red-50"
              )}
            >
              {result.passed ? (
                <Trophy className="h-10 w-10 text-green-500" />
              ) : (
                <XCircle className="h-10 w-10 text-red-500" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              {result.passed ? "Congratulations!" : "Not quite there"}
            </h2>
            <p className="mt-2 text-gray-500">
              {result.passed
                ? "You passed the quiz!"
                : `You need ${result.passMark}% to pass. Try again.`}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {result.score.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                <div className="text-xs text-gray-500">Correct</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {result.passMark}%
                </div>
                <div className="text-xs text-gray-500">Pass mark</div>
              </div>
            </div>

            <div className="mt-8 flex gap-3 justify-center">
              <Link href={`/dashboard/my-courses/${courseId}`}>
                <Button variant="outline">Back to course</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="mx-auto max-w-3xl py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-sm text-gray-500">
            Question {currentQ + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {timeLeft !== null && (
            <Badge
              variant={timeLeft < 60 ? "destructive" : "secondary"}
              className="gap-1 py-1.5 px-3 text-sm"
            >
              <Clock className="h-3.5 w-3.5" />
              {formatTime(timeLeft)}
            </Badge>
          )}
          <Badge variant="outline" className="py-1.5 px-3">
            {answeredCount}/{quiz.questions.length} answered
          </Badge>
        </div>
      </div>

      {/* Progress dots */}
      <div className="mb-8 flex gap-1.5 flex-wrap">
        {quiz.questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentQ(i)}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-all",
              i === currentQ
                ? "bg-blue-600 scale-125"
                : answers[q.id]
                  ? "bg-blue-300"
                  : "bg-gray-200"
            )}
          />
        ))}
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{question.type.replace("_", " ")}</Badge>
            <span className="text-xs text-gray-500">{question.points} point{question.points > 1 ? "s" : ""}</span>
          </div>
          <CardTitle className="mt-3 text-lg">{question.text}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => selectAnswer(question.id, option.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm transition-all",
                  answers[question.id] === option.id
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
                    answers[question.id] === option.id
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  )}
                >
                  {answers[question.id] === option.id && (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </div>
                {option.text}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        {currentQ < quiz.questions.length - 1 ? (
          <Button
            onClick={() => setCurrentQ(currentQ + 1)}
            className="gap-1"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting || answeredCount < quiz.questions.length}
            className="gap-1"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
