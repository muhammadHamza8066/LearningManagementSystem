# PHP quiz module

A small PHP/MySQL version of the quiz submission and grading flow. It
mirrors the logic in the main app so the same feature can be shown in
plain PHP without a framework.

## Layout

- `config/Database.php` - single shared PDO connection, read from env vars
- `lib/Response.php` - JSON response helper
- `lib/Auth.php` - resolves the current user from the PHP session
- `api/submit_quiz.php` - grades an attempt and stores the result
- `schema.sql` - the tables this module uses

## How it works

`POST /php/api/submit_quiz.php?quizId=<id>` with a JSON body:

```json
{
  "answers": [
    { "questionId": "q1", "selectedOptionId": "o3" },
    { "questionId": "q2", "selectedOptionId": "o5" }
  ]
}
```

The endpoint loads the quiz with its questions and options in one query,
grades the multiple choice and true/false answers against the correct
option, works out a percentage score, and saves the submission and its
answers inside a transaction. The response reports the score, whether it
passed the pass mark, and how many answers were correct.

## Running locally

1. Create a MySQL database and import `schema.sql`.
2. Set the connection env vars: `DB_HOST`, `DB_PORT`, `DB_NAME`,
   `DB_USER`, `DB_PASS`.
3. Serve the folder with any PHP runtime, for example:

   ```
   php -S localhost:8000
   ```
