"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, Plus, Send, Loader2, User } from "lucide-react";
import Link from "next/link";

interface Discussion {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  user: { name: string };
  _count: { replies: number };
}

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string; role: string };
}

interface DiscussionDetail extends Discussion {
  replies: Reply[];
}

export default function CourseDiscussionsPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [selected, setSelected] = useState<DiscussionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [replyText, setReplyText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${courseId}/discussions`)
      .then((r) => r.json())
      .then((d) => setDiscussions(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId]);

  async function createDiscussion() {
    if (!newTitle.trim() || !newContent.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
      const d = await res.json();
      setDiscussions((prev) => [d, ...prev]);
      setShowNew(false);
      setNewTitle("");
      setNewContent("");
    } catch {}
    setPosting(false);
  }

  async function loadDiscussion(id: string) {
    const res = await fetch(`/api/discussions/${id}/replies`);
    const data = await res.json();
    setSelected(data);
  }

  async function postReply() {
    if (!replyText.trim() || !selected) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/discussions/${selected.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText }),
      });
      const reply = await res.json();
      setSelected((prev) => prev ? { ...prev, replies: [...prev.replies, reply] } : prev);
      setReplyText("");
    } catch {}
    setPosting(false);
  }

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;

  if (selected) {
    return (
      <div className="space-y-6 mx-auto max-w-3xl">
        <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to discussions
        </Button>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900">{selected.title}</h2>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <span>{selected.user.name}</span>
              <span>{new Date(selected.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">{selected.content}</p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">{selected.replies?.length || 0} Replies</h3>
          {(selected.replies || []).map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                    {r.user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{r.user.name}</span>
                  {r.user.role === "INSTRUCTOR" && <Badge variant="default" className="text-[10px]">Instructor</Badge>}
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{r.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          <textarea
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
          />
          <Button onClick={postReply} disabled={posting || !replyText.trim()} size="icon" className="shrink-0 self-end">
            {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/discussions"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <h1 className="text-2xl font-bold text-gray-900">Course Discussions</h1>
        </div>
        <Button onClick={() => setShowNew(true)} className="gap-1" size="sm"><Plus className="h-4 w-4" /> New Topic</Button>
      </div>

      {showNew && (
        <Card><CardContent className="p-5 space-y-3">
          <Input placeholder="Discussion title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <textarea className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[80px]" placeholder="What would you like to discuss?" value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={3} />
          <div className="flex gap-2">
            <Button size="sm" onClick={createDiscussion} disabled={posting}>{posting ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : null}Post</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
          </div>
        </CardContent></Card>
      )}

      {discussions.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-12 text-center">
          <MessageSquare className="h-10 w-10 text-gray-300" />
          <h3 className="mt-3 font-semibold text-gray-900">No discussions yet</h3>
          <p className="mt-1 text-sm text-gray-500">Start the first discussion in this course.</p>
        </CardContent></Card>
      ) : (
        discussions.map((d) => (
          <Card key={d.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => loadDiscussion(d.id)}>
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900">{d.title}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{d.content}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                <span>{d.user.name}</span>
                <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{d._count.replies} replies</span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
