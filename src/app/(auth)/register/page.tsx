"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Loader2, BookOpen, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">LearnForge</span>
        </Link>
        <div>
          <h2 className="text-4xl font-extrabold text-white">
            Start your journey.
          </h2>
          <p className="mt-3 text-lg text-blue-100">
            Create an account to learn new skills or share your knowledge with
            students around the world.
          </p>
        </div>
        <p className="text-sm text-blue-200">
          Built by Muhammad Hamza
        </p>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                LearnForge
              </span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-2 text-sm text-gray-500">
            Choose your role and fill in your details to get started.
          </p>

          {/* Role selector */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                role === "STUDENT"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <BookOpen
                className={cn(
                  "h-6 w-6",
                  role === "STUDENT" ? "text-blue-600" : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  role === "STUDENT" ? "text-blue-700" : "text-gray-600"
                )}
              >
                Student
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole("INSTRUCTOR")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                role === "INSTRUCTOR"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Users
                className={cn(
                  "h-6 w-6",
                  role === "INSTRUCTOR" ? "text-blue-600" : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  role === "INSTRUCTOR" ? "text-blue-700" : "text-gray-600"
                )}
              >
                Instructor
              </span>
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <Input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {role === "INSTRUCTOR" && (
              <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                Instructor accounts need admin approval before you can publish
                courses.
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
