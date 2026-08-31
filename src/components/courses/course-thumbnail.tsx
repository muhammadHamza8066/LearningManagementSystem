"use client";

import { BookOpen } from "lucide-react";

const gradients = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-teal-500 to-emerald-600",
  "from-fuchsia-500 to-violet-600",
];

const icons: Record<string, string> = {
  "programming": "{ }",
  "data": "DS",
  "web": "</>",
  "database": "DB",
  "artificial": "AI",
  "cyber": "SEC",
  "security": "SEC",
  "cloud": "CLD",
  "software": "SE",
  "network": "NET",
  "operating": "OS",
  "javascript": "JS",
  "machine": "ML",
};

function getGradient(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

function getIcon(title: string) {
  const lower = title.toLowerCase();
  for (const [key, icon] of Object.entries(icons)) {
    if (lower.includes(key)) return icon;
  }
  return title.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export function CourseThumbnail({
  title,
  thumbnail,
  className = "",
}: {
  title: string;
  thumbnail?: string | null;
  className?: string;
}) {
  if (thumbnail) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
        <img src={thumbnail} alt={title} className="h-full w-full object-cover" />
      </div>
    );
  }

  const gradient = getGradient(title);
  const icon = getIcon(title);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/90">
        <span className="text-3xl sm:text-4xl font-bold tracking-wider">{icon}</span>
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjEiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0iI2ZmZiIvPjwvZz48L3N2Zz4=')] opacity-30" />
    </div>
  );
}
