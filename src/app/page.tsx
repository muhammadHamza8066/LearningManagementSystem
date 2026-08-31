import Link from "next/link";
import { PublicNavbar } from "@/components/layout/public-navbar";
import {
  BookOpen,
  Award,
  BarChart3,
  Users,
  Play,
  Shield,
  Zap,
  Globe,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Course Builder",
    description:
      "Drag-and-drop modules and lessons. Rich text editor, video uploads, and file attachments in every lesson.",
  },
  {
    icon: Play,
    title: "Video Lessons",
    description:
      "Stream video content with automatic progress tracking. Students pick up exactly where they left off.",
  },
  {
    icon: BarChart3,
    title: "Quiz Engine",
    description:
      "MCQ, true/false, and short answer questions with auto-grading, time limits, and configurable pass marks.",
  },
  {
    icon: Award,
    title: "Certificates",
    description:
      "Auto-generated PDF certificates on course completion. Each one is unique and verifiable.",
  },
  {
    icon: Users,
    title: "Three Roles",
    description:
      "Admin, Instructor, and Student dashboards with role-based access. Approval workflows for new instructors.",
  },
  {
    icon: Shield,
    title: "SCORM Ready",
    description:
      "Upload SCORM 1.2 and 2004 packages directly. The LMS tracks completion and scores automatically.",
  },
  {
    icon: Zap,
    title: "Real-time Progress",
    description:
      "Live progress bars, lesson completion tracking, and enrollment analytics across every course.",
  },
  {
    icon: Globe,
    title: "Stripe Payments",
    description:
      "Sell courses with Stripe. Free and paid enrollment, instructor earnings tracking, and revenue reports.",
  },
];

const stats = [
  { value: "10K+", label: "Active learners" },
  { value: "500+", label: "Courses published" },
  { value: "98%", label: "Completion rate" },
  { value: "50+", label: "Expert instructors" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-indigo-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Zap className="h-3.5 w-3.5" />
              Open-source LMS platform
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Learn anything.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Teach everything.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
              A full-featured learning management system with course creation,
              quizzes, progress tracking, certificates, and payments. Built for
              instructors who care about their students.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:bg-blue-800"
              >
                Start learning free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400"
              >
                Browse courses
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-gray-900">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to run an LMS
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From course creation to certificate delivery, every feature an
              instructor or organization needs is built in.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Get started in minutes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Whether you are a student looking to learn or an instructor ready
              to teach, the setup is simple.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your account",
                description:
                  "Sign up as a student or instructor. Students get instant access. Instructors are reviewed and approved by an admin.",
              },
              {
                step: "02",
                title: "Build or browse courses",
                description:
                  "Instructors create courses with video lessons, quizzes, and attachments. Students browse the catalog and enroll.",
              },
              {
                step: "03",
                title: "Learn and earn certificates",
                description:
                  "Complete lessons, pass quizzes, and get a downloadable certificate. Instructors track progress and earnings.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="mb-4 text-5xl font-extrabold text-blue-100">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Free courses to start. Pay only for premium content.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-8 lg:grid-cols-2">
            {/* Free tier */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-gray-900">
                  $0
                </span>
                <span className="text-gray-500">/forever</span>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Access all free courses and track your progress.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Unlimited free courses",
                  "Progress tracking",
                  "Discussion forums",
                  "Completion certificates",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 block rounded-xl border border-gray-300 py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Get started
              </Link>
            </div>

            {/* Pro tier */}
            <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-lg">
              <div className="absolute -top-3 left-6 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
                Popular
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Premium Courses
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-gray-900">
                  $9.99
                </span>
                <span className="text-gray-500">/course</span>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Unlock premium courses with advanced content.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Everything in Free",
                  "Premium video content",
                  "Graded assignments",
                  "Instructor feedback",
                  "Verified certificates",
                  "Priority support",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 block rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                Start learning
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-16 text-center shadow-2xl sm:px-16">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjA4Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')] opacity-40" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to start teaching or learning?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
                Join thousands of students and instructors on LearnForge.
                Create your free account today.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50"
                >
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              LF
            </div>
            <span className="text-lg font-bold text-gray-900">LearnForge</span>
          </div>
          <p className="text-sm text-gray-500">
            Built by Muhammad Hamza. Full-stack LMS portfolio project.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/courses"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
