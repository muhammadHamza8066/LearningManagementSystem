"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    level: "Beginner",
    isFree: true,
    price: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.push(`/instructor/courses/${data.id}/edit`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/instructor">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Course</h1>
          <p className="text-sm text-gray-500">
            Start with the basics. You can add modules and lessons next.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Course Title
              </label>
              <Input
                placeholder="e.g. Complete Web Development Bootcamp"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="What will students learn in this course?"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Level
                </label>
                <select
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Pricing
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isFree: true, price: 0 })}
                  className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                    form.isFree
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Free
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isFree: false })}
                  className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                    !form.isFree
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Paid
                </button>
              </div>
              {!form.isFree && (
                <div className="mt-3">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Price (USD)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="9.99"
                    value={form.price || ""}
                    onChange={(e) =>
                      setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create and continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
