const BASE = "http://localhost:3000";

let instructorCookie = "";
let studentCookie = "";
let adminCookie = "";
let testCourseId = "";
let testModuleId = "";
let testLessonId = "";
let testQuizId = "";
let testCourseSlug = "";

let passed = 0;
let failed = 0;
const failures = [];

async function req(method, path, body, cookie) {
  const headers = { "Content-Type": "application/json" };
  if (cookie) headers["Cookie"] = cookie;
  const opts = { method, headers, redirect: "manual" };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  let data = null;
  try { data = JSON.parse(await res.text()); } catch {}
  return { status: res.status, data, headers: res.headers };
}

async function login(email, password) {
  const csrfRes = await fetch(`${BASE}/api/auth/csrf`);
  const csrfData = await csrfRes.json();
  const csrfCookie = csrfRes.headers.get("set-cookie") || "";
  const loginRes = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: csrfCookie },
    body: new URLSearchParams({ csrfToken: csrfData.csrfToken, email, password, redirect: "false", callbackUrl: `${BASE}/dashboard`, json: "true" }),
    redirect: "manual",
  });
  const cookies = loginRes.headers.getSetCookie?.() || [];
  const all = [csrfCookie.split(";")[0]];
  for (const c of cookies) all.push(c.split(";")[0]);
  return all.join("; ");
}

function test(name, condition, detail) {
  if (condition) { console.log(`  PASS  ${name}`); passed++; }
  else { console.log(`  FAIL  ${name}${detail ? " -> " + detail : ""}`); failed++; failures.push(name + (detail ? ": " + detail : "")); }
}

async function run() {
  console.log("=".repeat(60));
  console.log("  AcademILMS - Full Test Suite (Phase 1-5)");
  console.log("=".repeat(60));

  // PHASE 1: AUTH
  console.log("\n--- PHASE 1: Authentication & Registration ---\n");

  const regRes = await req("POST", "/api/register", { name: "Test User", email: `test_${Date.now()}@test.com`, password: "testpass123", role: "STUDENT" });
  test("Register new student", regRes.status === 201, `status: ${regRes.status}`);

  const dupRes = await req("POST", "/api/register", { name: "Admin", email: "admin@learnforge.dev", password: "admin123", role: "STUDENT" });
  test("Reject duplicate email", dupRes.status === 409, `status: ${dupRes.status}`);

  const badRes = await req("POST", "/api/register", { name: "X", email: "bad", password: "12" });
  test("Reject invalid input", badRes.status === 400, `status: ${badRes.status}`);

  instructorCookie = await login("instructor@learnforge.dev", "instructor123");
  test("Instructor login", instructorCookie.length > 50);

  studentCookie = await login("student@learnforge.dev", "student123");
  test("Student login", studentCookie.length > 50);

  adminCookie = await login("admin@learnforge.dev", "admin123");
  test("Admin login", adminCookie.length > 50);

  const sessRes = await req("GET", "/api/auth/session", null, instructorCookie);
  test("Session returns user", sessRes.data?.user?.email === "instructor@learnforge.dev", `got: ${sessRes.data?.user?.email}`);

  const catRes = await req("GET", "/api/categories");
  test("Fetch categories", catRes.status === 200 && Array.isArray(catRes.data));
  test("8 categories seeded", catRes.data?.length === 8, `got: ${catRes.data?.length}`);

  // PHASE 2: COURSE ENGINE
  console.log("\n--- PHASE 2: Course Engine ---\n");

  const courseRes = await req("POST", "/api/courses", { title: "Auto Test Course " + Date.now(), description: "Test course description", categoryId: catRes.data?.[0]?.id, level: "Beginner", isFree: true, price: 0 }, instructorCookie);
  test("Create course", courseRes.status === 201 && courseRes.data?.id, `status: ${courseRes.status}, err: ${courseRes.data?.error}`);
  testCourseId = courseRes.data?.id;
  testCourseSlug = courseRes.data?.slug;

  const getCRes = await req("GET", `/api/courses/${testCourseId}`, null, instructorCookie);
  test("Fetch course by ID", getCRes.status === 200 && getCRes.data?.title, `status: ${getCRes.status}`);

  const updRes = await req("PATCH", `/api/courses/${testCourseId}`, { title: "Updated Course", description: "Updated desc", isFree: true }, instructorCookie);
  test("Update course", updRes.status === 200, `status: ${updRes.status}, err: ${updRes.data?.error}`);

  const stuUpdRes = await req("PATCH", `/api/courses/${testCourseId}`, { title: "Hacked" }, studentCookie);
  test("Student cannot update course", stuUpdRes.status === 403, `status: ${stuUpdRes.status}`);

  const modRes = await req("POST", `/api/courses/${testCourseId}/modules`, { title: "Module A" }, instructorCookie);
  test("Create module", modRes.status === 201 && modRes.data?.id, `status: ${modRes.status}, err: ${modRes.data?.error}`);
  testModuleId = modRes.data?.id;

  const mod2Res = await req("POST", `/api/courses/${testCourseId}/modules`, { title: "Module B" }, instructorCookie);
  test("Create second module", mod2Res.status === 201, `status: ${mod2Res.status}`);

  const modsRes = await req("GET", `/api/courses/${testCourseId}/modules`, null, instructorCookie);
  test("Fetch modules", modsRes.status === 200 && Array.isArray(modsRes.data));
  test("2 modules created", modsRes.data?.length === 2, `got: ${modsRes.data?.length}`);

  const lesRes = await req("POST", `/api/courses/${testCourseId}/modules/${testModuleId}/lessons`, { title: "Lesson 1", content: "Lesson one content here.", isFree: true }, instructorCookie);
  test("Create lesson", lesRes.status === 201 && lesRes.data?.id, `status: ${lesRes.status}, err: ${lesRes.data?.error}`);
  testLessonId = lesRes.data?.id;

  const les2Res = await req("POST", `/api/courses/${testCourseId}/modules/${testModuleId}/lessons`, { title: "Lesson 2", content: "Second lesson content.", isFree: false }, instructorCookie);
  test("Create second lesson", les2Res.status === 201, `status: ${les2Res.status}`);

  const updLesRes = await req("PUT", `/api/courses/${testCourseId}/modules/${testModuleId}/lessons`, { lessonId: testLessonId, title: "Updated Lesson 1", content: "Updated content.", isFree: true }, instructorCookie);
  test("Update lesson", updLesRes.status === 200, `status: ${updLesRes.status}`);

  const pubRes = await req("PATCH", `/api/courses/${testCourseId}/publish`, null, instructorCookie);
  test("Publish course", pubRes.status === 200 && pubRes.data?.status === "PUBLISHED", `status: ${pubRes.status}, err: ${pubRes.data?.error}`);

  const catlogRes = await req("GET", "/api/courses?page=1&limit=12");
  test("Course catalog works", catlogRes.status === 200 && catlogRes.data?.courses);
  test("Published course in catalog", catlogRes.data?.courses?.length > 0, `count: ${catlogRes.data?.courses?.length}`);

  const instrListRes = await req("GET", "/api/instructor/courses", null, instructorCookie);
  test("Instructor courses list", instrListRes.status === 200 && Array.isArray(instrListRes.data));

  const enrollRes = await req("POST", `/api/courses/${testCourseId}/enroll`, null, studentCookie);
  test("Student enrolls", enrollRes.status === 201, `status: ${enrollRes.status}, err: ${enrollRes.data?.error}`);

  const dupEnroll = await req("POST", `/api/courses/${testCourseId}/enroll`, null, studentCookie);
  test("Reject duplicate enrollment", dupEnroll.status === 409, `status: ${dupEnroll.status}`);

  const eStatRes = await req("GET", `/api/courses/${testCourseId}/enrollment-status`, null, studentCookie);
  test("Enrollment status true", eStatRes.data?.enrolled === true);

  const stuEnrRes = await req("GET", "/api/student/enrollments", null, studentCookie);
  test("Student enrollments list", stuEnrRes.status === 200 && Array.isArray(stuEnrRes.data));

  // PHASE 3: PROGRESS & QUIZZES
  console.log("\n--- PHASE 3: Progress & Quizzes ---\n");

  const progRes = await req("POST", `/api/courses/${testCourseId}/progress`, { lessonId: testLessonId }, studentCookie);
  test("Mark lesson complete", progRes.status === 200 && progRes.data?.progress > 0, `status: ${progRes.status}, progress: ${progRes.data?.progress}`);

  const getProgRes = await req("GET", `/api/courses/${testCourseId}/progress`, null, studentCookie);
  test("Fetch progress", getProgRes.status === 200 && getProgRes.data?.progress > 0);
  test("Lesson progress tracked", getProgRes.data?.lessonProgress?.length > 0);

  const qRes = await req("POST", `/api/courses/${testCourseId}/modules/${testModuleId}/quiz`, {
    title: "Auto Test Quiz", passMark: 50,
    questions: [
      { text: "What is 2+2?", type: "MCQ", points: 1, options: [{ text: "3", isCorrect: false }, { text: "4", isCorrect: true }, { text: "5", isCorrect: false }] },
      { text: "JS runs in browser", type: "TRUE_FALSE", points: 1, options: [{ text: "True", isCorrect: true }, { text: "False", isCorrect: false }] },
      { text: "Which declares constant?", type: "MCQ", points: 1, options: [{ text: "var", isCorrect: false }, { text: "let", isCorrect: false }, { text: "const", isCorrect: true }, { text: "def", isCorrect: false }] },
    ],
  }, instructorCookie);
  test("Create quiz (3 questions)", qRes.status === 201 && qRes.data?.id, `status: ${qRes.status}, err: ${qRes.data?.error}`);
  testQuizId = qRes.data?.id;

  const getQRes = await req("GET", `/api/courses/${testCourseId}/modules/${testModuleId}/quiz`, null, instructorCookie);
  test("Fetch quiz as instructor", getQRes.status === 200 && getQRes.data?.questions?.length === 3);

  if (testQuizId) {
    const stuQRes = await req("GET", `/api/quiz/${testQuizId}`, null, studentCookie);
    test("Student fetch quiz", stuQRes.status === 200 && stuQRes.data?.questions?.length === 3);
    test("Correct answers hidden", stuQRes.data?.questions?.[0]?.options?.[0]?.isCorrect === undefined);

    const correctAnswers = getQRes.data.questions.map((q) => ({ questionId: q.id, selectedOptionId: q.options.find((o) => o.isCorrect)?.id }));
    const subRes = await req("POST", `/api/quiz/${testQuizId}/submit`, { answers: correctAnswers }, studentCookie);
    test("Submit quiz (all correct) = 100%", subRes.status === 200 && subRes.data?.score === 100, `score: ${subRes.data?.score}`);
    test("Quiz passed", subRes.data?.passed === true);
    test("3/3 correct", subRes.data?.correctAnswers === 3, `got: ${subRes.data?.correctAnswers}`);

    const wrongAnswers = getQRes.data.questions.map((q) => ({ questionId: q.id, selectedOptionId: q.options.find((o) => !o.isCorrect)?.id }));
    const wrongRes = await req("POST", `/api/quiz/${testQuizId}/submit`, { answers: wrongAnswers }, studentCookie);
    test("Submit quiz (all wrong) = 0%", wrongRes.status === 200 && wrongRes.data?.score === 0, `score: ${wrongRes.data?.score}`);
    test("Quiz failed", wrongRes.data?.passed === false);
  }

  const dupQRes = await req("POST", `/api/courses/${testCourseId}/modules/${testModuleId}/quiz`, { title: "Dup", passMark: 50, questions: [{ text: "Q?", type: "MCQ", points: 1, options: [{ text: "A", isCorrect: true }] }] }, instructorCookie);
  test("Reject duplicate quiz", dupQRes.status === 409, `status: ${dupQRes.status}`);

  const gradeRes = await req("GET", "/api/instructor/grades", null, instructorCookie);
  test("Grade book loads", gradeRes.status === 200 && Array.isArray(gradeRes.data));
  if (Array.isArray(gradeRes.data)) {
    test("Grade book has submissions", gradeRes.data.some((c) => c.modules?.some((m) => m.quiz?.submissions?.length > 0)));
  } else {
    test("Grade book has submissions", false, "grade book did not return array");
  }

  // SECURITY
  console.log("\n--- Security ---\n");

  const noAuth1 = await req("POST", "/api/courses", { title: "Hack" });
  test("No auth: create course blocked", noAuth1.status === 401);

  const noAuth2 = await req("POST", `/api/courses/${testCourseId}/enroll`);
  test("No auth: enroll blocked", noAuth2.status === 401);

  const noAuth3 = await req("POST", `/api/courses/${testCourseId}/progress`, { lessonId: testLessonId });
  test("No auth: progress blocked", noAuth3.status === 401);

  const stuCreate = await req("POST", "/api/courses", { title: "Student Course" }, studentCookie);
  test("Student cannot create course", stuCreate.status === 401);

  const stuQuiz = await req("POST", `/api/courses/${testCourseId}/modules/${testModuleId}/quiz`, { title: "Hacked", passMark: 50, questions: [] }, studentCookie);
  test("Student cannot create quiz", stuQuiz.status === 403);

  // CLEANUP
  console.log("\n--- Cleanup ---\n");

  // PHASE 4: CERTIFICATES & PAYMENTS
  console.log("\n--- PHASE 4: Certificates & Payments ---\n");

  const certGetRes = await req("GET", `/api/courses/${testCourseId}/certificate`, null, studentCookie);
  test("Certificate auto-generated on completion", certGetRes.status === 200);

  const certListRes = await req("GET", "/api/student/certificates", null, studentCookie);
  test("Student certificates list", certListRes.status === 200 && Array.isArray(certListRes.data));

  const reviewRes = await req("POST", `/api/courses/${testCourseId}/review`, { rating: 5, comment: "Great course!" }, studentCookie);
  test("Submit review", reviewRes.status === 200 && reviewRes.data?.rating === 5);

  const badReview = await req("POST", `/api/courses/${testCourseId}/review`, { rating: 0 }, studentCookie);
  test("Reject invalid rating", badReview.status === 400);

  const checkoutRes = await req("POST", `/api/courses/${testCourseId}/checkout`, null, studentCookie);
  test("Checkout endpoint responds", checkoutRes.status === 200 || checkoutRes.status === 400);

  // PHASE 5: DISCUSSIONS & ADMIN
  console.log("\n--- PHASE 5: Discussions & Admin ---\n");

  const discRes = await req("POST", `/api/courses/${testCourseId}/discussions`, { title: "Test Discussion", content: "This is a test topic" }, studentCookie);
  test("Create discussion", discRes.status === 201 && discRes.data?.id, `status: ${discRes.status}`);

  const discListRes = await req("GET", `/api/courses/${testCourseId}/discussions`, null, studentCookie);
  test("List discussions", discListRes.status === 200 && Array.isArray(discListRes.data));

  if (discRes.data?.id) {
    const replyRes = await req("POST", `/api/discussions/${discRes.data.id}/replies`, { content: "Test reply here" }, instructorCookie);
    test("Post reply to discussion", replyRes.status === 201);

    const threadRes = await req("GET", `/api/discussions/${discRes.data.id}/replies`, null, studentCookie);
    test("Fetch discussion with replies", threadRes.status === 200 && threadRes.data?.replies?.length > 0);
  }

  const adminStatsRes = await req("GET", "/api/admin/stats", null, adminCookie);
  test("Admin stats endpoint", adminStatsRes.status === 200 && adminStatsRes.data?.totalUsers > 0, `users: ${adminStatsRes.data?.totalUsers}`);
  test("Admin stats has categories", Array.isArray(adminStatsRes.data?.coursesByCategory));
  test("Admin stats has recent users", Array.isArray(adminStatsRes.data?.recentUsers));

  const adminUsersRes = await req("GET", "/api/admin/users", null, adminCookie);
  test("Admin users list", adminUsersRes.status === 200 && Array.isArray(adminUsersRes.data) && adminUsersRes.data.length > 0);

  const noAuthAdmin = await req("GET", "/api/admin/stats");
  test("No auth: admin stats blocked", noAuthAdmin.status === 401);

  const studentAdmin = await req("GET", "/api/admin/stats", null, studentCookie);
  test("Student: admin stats blocked", studentAdmin.status === 401);

  // FINAL CLEANUP
  console.log("\n--- Final Cleanup ---\n");

  if (testQuizId) { const d = await req("DELETE", `/api/courses/${testCourseId}/modules/${testModuleId}/quiz`, null, instructorCookie); test("Delete quiz", d.status === 200); }
  if (testLessonId) { const d = await req("DELETE", `/api/courses/${testCourseId}/modules/${testModuleId}/lessons?lessonId=${testLessonId}`, null, instructorCookie); test("Delete lesson", d.status === 200); }
  if (testCourseId) { const d = await req("DELETE", `/api/courses/${testCourseId}`, null, instructorCookie); test("Delete course", d.status === 200); }

  // RESULTS
  console.log("\n" + "=".repeat(60));
  console.log(`  RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
  console.log("=".repeat(60));
  if (failures.length > 0) { console.log("\n  Failed tests:"); failures.forEach((f) => console.log(`    - ${f}`)); }
  console.log("");
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => { console.error("Crashed:", e); process.exit(1); });
