"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, Download, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertData {
  id: string;
  issuedAt: string;
  user: { name: string };
  course: { title: string; instructor: { name: string } };
}

export default function CertificateViewPage() {
  const params = useParams();
  const certId = params.certificateId as string;
  const [cert, setCert] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/certificate/${certId}`)
      .then((r) => r.json())
      .then(setCert)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [certId]);

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
  if (!cert) return <div className="flex min-h-screen items-center justify-center text-gray-500">Certificate not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex justify-end">
          <Button onClick={() => window.print()} className="gap-2 print:hidden">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
        <div className="aspect-[1.414/1] overflow-hidden rounded-xl border-4 border-amber-400 bg-white shadow-2xl print:border-2 print:shadow-none" id="certificate">
          <div className="flex h-full flex-col items-center justify-between p-12 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 text-amber-600">
                <Award className="h-8 w-8" />
                <span className="text-lg font-bold tracking-widest uppercase">LearnForge</span>
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Certificate of Completion</p>
              <p className="text-lg text-gray-500">This certifies that</p>
              <p className="text-4xl font-bold text-gray-900">{cert.user.name}</p>
              <p className="text-lg text-gray-500">has successfully completed the course</p>
              <p className="text-2xl font-semibold text-blue-700">{cert.course.title}</p>
              <p className="text-sm text-gray-400">Instructed by {cert.course.instructor.name}</p>
            </div>
            <div className="flex w-full items-end justify-between border-t border-gray-200 pt-6">
              <div className="text-left">
                <p className="text-xs text-gray-400">Date Issued</p>
                <p className="text-sm font-medium text-gray-700">{new Date(cert.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Certificate ID</p>
                <p className="text-sm font-mono text-gray-700">{cert.id.slice(-12).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
