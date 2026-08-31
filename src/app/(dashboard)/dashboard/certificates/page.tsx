"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download, Loader2, ExternalLink } from "lucide-react";

interface CertificateData {
  id: string;
  issuedAt: string;
  course: { id: string; title: string; instructor: { name: string } };
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/certificates")
      .then((r) => r.json())
      .then((data) => setCerts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-sm text-gray-500">Certificates earned from completed courses.</p>
      </div>
      {certs.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16 text-center">
          <Award className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 font-semibold text-gray-900">No certificates yet</h3>
          <p className="mt-1 text-sm text-gray-500">Complete a course to earn your first certificate.</p>
          <Link href="/courses" className="mt-4"><Button size="sm">Browse courses</Button></Link>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 text-center">
                <Award className="mx-auto h-12 w-12 text-amber-500" />
                <h3 className="mt-3 font-semibold text-gray-900 line-clamp-2">{cert.course.title}</h3>
                <p className="mt-1 text-xs text-gray-500">by {cert.course.instructor.name}</p>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Issued {new Date(cert.issuedAt).toLocaleDateString()}</span>
                  <Link href={`/certificate/${cert.id}`}>
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      <ExternalLink className="h-3 w-3" /> View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
