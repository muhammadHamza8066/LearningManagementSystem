<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../lib/Response.php';
require_once __DIR__ . '/../lib/Auth.php';

/**
 * Submit a quiz attempt, grade it, and store the result.
 *
 * Method: POST
 * Query:  ?quizId=<id>
 * Body:   { "answers": [ { "questionId": "..", "selectedOptionId": ".." } ] }
 *
 * MCQ and true/false questions are graded automatically against the
 * correct option. Short answer questions are stored for manual review.
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    Response::error('Method not allowed', 405);
}

$userId = Auth::userId();
if ($userId === null) {
    Response::error('Unauthorized', 401);
}

$quizId = $_GET['quizId'] ?? '';
if (!is_string($quizId) || $quizId === '') {
    Response::error('Missing quizId', 400);
}

$body = json_decode(file_get_contents('php://input') ?: '', true);
$answers = $body['answers'] ?? null;
if (!is_array($answers)) {
    Response::error('Missing answers', 400);
}

$db = Database::connection();

// Load the quiz with its questions and options in one round trip.
$stmt = $db->prepare(
    'SELECT q.id AS question_id, q.type, q.points,
            o.id AS option_id, o.is_correct
       FROM questions q
       LEFT JOIN options o ON o.question_id = q.id
      WHERE q.quiz_id = :quizId
      ORDER BY q.position ASC'
);
$stmt->execute([':quizId' => $quizId]);
$rows = $stmt->fetchAll();

if (count($rows) === 0) {
    Response::error('Quiz not found', 404);
}

// Group the flat rows into questions, each with its options.
$questions = [];
foreach ($rows as $row) {
    $qid = $row['question_id'];
    if (!isset($questions[$qid])) {
        $questions[$qid] = [
            'type'    => $row['type'],
            'points'  => (int) $row['points'],
            'options' => [],
        ];
    }
    if ($row['option_id'] !== null) {
        $questions[$qid]['options'][$row['option_id']] = (bool) $row['is_correct'];
    }
}

// Fetch the pass mark separately so we can report it back.
$passStmt = $db->prepare('SELECT pass_mark FROM quizzes WHERE id = :quizId');
$passStmt->execute([':quizId' => $quizId]);
$passMark = (float) ($passStmt->fetchColumn() ?: 0);

$totalPoints  = 0;
$earnedPoints = 0;
$graded       = [];

foreach ($answers as $answer) {
    $questionId = $answer['questionId'] ?? '';
    if (!isset($questions[$questionId])) {
        continue;
    }

    $question = $questions[$questionId];
    $totalPoints += $question['points'];

    $selected  = $answer['selectedOptionId'] ?? null;
    $isCorrect = false;

    if ($question['type'] === 'MCQ' || $question['type'] === 'TRUE_FALSE') {
        $isCorrect = $selected !== null && ($question['options'][$selected] ?? false);
    }

    if ($isCorrect) {
        $earnedPoints += $question['points'];
    }

    $graded[] = [
        'questionId' => $questionId,
        'text'       => $selected ?? ($answer['text'] ?? ''),
        'isCorrect'  => $isCorrect,
    ];
}

$score = $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100, 1) : 0.0;

// Store the submission and its answers together so a failure leaves
// nothing half written.
try {
    $db->beginTransaction();

    $submissionId = bin2hex(random_bytes(12));

    $insertSubmission = $db->prepare(
        'INSERT INTO submissions (id, user_id, quiz_id, score, status, graded_at, created_at)
         VALUES (:id, :userId, :quizId, :score, :status, NOW(), NOW())'
    );
    $insertSubmission->execute([
        ':id'     => $submissionId,
        ':userId' => $userId,
        ':quizId' => $quizId,
        ':score'  => $score,
        ':status' => 'GRADED',
    ]);

    $insertAnswer = $db->prepare(
        'INSERT INTO answers (id, submission_id, question_id, text, is_correct)
         VALUES (:id, :submissionId, :questionId, :text, :isCorrect)'
    );
    foreach ($graded as $answer) {
        $insertAnswer->execute([
            ':id'           => bin2hex(random_bytes(12)),
            ':submissionId' => $submissionId,
            ':questionId'   => $answer['questionId'],
            ':text'         => $answer['text'],
            ':isCorrect'    => $answer['isCorrect'] ? 1 : 0,
        ]);
    }

    $db->commit();
} catch (Throwable $e) {
    $db->rollBack();
    error_log('Failed to submit quiz: ' . $e->getMessage());
    Response::error('Failed to submit quiz', 500);
}

$correctCount = count(array_filter($graded, static fn ($a) => $a['isCorrect']));

Response::json([
    'submissionId'   => $submissionId,
    'score'          => $score,
    'passed'         => $score >= $passMark,
    'passMark'       => $passMark,
    'totalQuestions' => count($questions),
    'correctAnswers' => $correctCount,
]);
