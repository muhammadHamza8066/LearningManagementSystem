"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Star,
  Users,
  BookOpen,
  Clock,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CourseThumbnail } from "@/components/courses/course-thumbnail";
import { CourseCardSkeleton } from "@/components/ui/skeleton";

interface CourseCard {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  price: number;
  isFree: boolean;
  level?: string;
  instructor: { name: string; image?: string };
  category?: { name: string; slug: string };
  totalLessons: number;
  totalModules: number;
  enrollmentCount: number;
  avgRating: number;
  reviewCount: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "12",
      sort,
    });
    if (search) params.set("search", search);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedLevel) params.set("level", selectedLevel);

    fetch(`/api/courses?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setCourses(data.courses);
        setTotalPages(data.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, selectedCategory, selectedLevel, sort, page]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Course Catalog
          </h1>
          <p className="mt-2 text-gray-600">
            Browse courses from expert instructors across all categories.
          </p>
        </div>

        {/* Filters bar */}
        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </form>

          <div className="flex gap-3 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Course grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No courses found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
                    {/* Thumbnail */}
                    <div className="relative">
                      <CourseThumbnail title={course.title} thumbnail={course.thumbnail} className="aspect-video" />
                      {course.isFree && (
                        <Badge className="absolute left-3 top-3 bg-green-600 text-white">
                          Free
                        </Badge>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      {course.category && (
                        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-blue-600">
                          {course.category.name}
                        </p>
                      )}
                      <h3 className="line-clamp-2 text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        by {course.instructor.name}
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                        {course.avgRating > 0 && (
                          <span className="flex items-center gap-1 font-medium text-amber-600">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {course.avgRating}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {course.enrollmentCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {course.totalLessons} lessons
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                        <span className="text-lg font-bold text-gray-900">
                          {course.isFree ? "Free" : formatPrice(course.price)}
                        </span>
                        {course.level && (
                          <Badge variant="outline" className="text-[10px]">
                            {course.level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="px-4 text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
