-- Minimal MySQL schema for the quiz grading module.
-- Mirrors the quiz part of the main LearnForge data model.

CREATE TABLE users (
    id    VARCHAR(32) PRIMARY KEY,
    name  VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role  ENUM('ADMIN', 'INSTRUCTOR', 'STUDENT') NOT NULL DEFAULT 'STUDENT'
);

CREATE TABLE quizzes (
    id         VARCHAR(32) PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    pass_mark  DECIMAL(5,2) NOT NULL DEFAULT 70,
    time_limit INT NULL,
    module_id  VARCHAR(32) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
    id       VARCHAR(32) PRIMARY KEY,
    text     TEXT NOT NULL,
    type     ENUM('MCQ', 'TRUE_FALSE', 'SHORT_ANSWER') NOT NULL DEFAULT 'MCQ',
    points   INT NOT NULL DEFAULT 1,
    position INT NOT NULL DEFAULT 0,
    quiz_id  VARCHAR(32) NOT NULL,
    CONSTRAINT fk_questions_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE,
    INDEX idx_questions_quiz (quiz_id)
);

CREATE TABLE options (
    id          VARCHAR(32) PRIMARY KEY,
    text        VARCHAR(255) NOT NULL,
    is_correct  TINYINT(1) NOT NULL DEFAULT 0,
    question_id VARCHAR(32) NOT NULL,
    CONSTRAINT fk_options_question FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE,
    INDEX idx_options_question (question_id)
);

CREATE TABLE submissions (
    id         VARCHAR(32) PRIMARY KEY,
    score      DECIMAL(5,2) NULL,
    status     ENUM('SUBMITTED', 'GRADED') NOT NULL DEFAULT 'SUBMITTED',
    feedback   TEXT NULL,
    user_id    VARCHAR(32) NOT NULL,
    quiz_id    VARCHAR(32) NOT NULL,
    graded_at  DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_submissions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_submissions_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE,
    INDEX idx_submissions_user (user_id),
    INDEX idx_submissions_quiz (quiz_id)
);

CREATE TABLE answers (
    id            VARCHAR(32) PRIMARY KEY,
    text          TEXT NULL,
    is_correct    TINYINT(1) NOT NULL DEFAULT 0,
    submission_id VARCHAR(32) NOT NULL,
    question_id   VARCHAR(32) NOT NULL,
    CONSTRAINT fk_answers_submission FOREIGN KEY (submission_id) REFERENCES submissions (id) ON DELETE CASCADE,
    CONSTRAINT fk_answers_question FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE
);
