# Copilot Instructions

## Build and Test

- This is a dependency-free browser app; use Node.js 20 or newer.
- Run the full test suite with `npm test`.
- Run one test file with `node --test tests/quiz.test.js` or `node --test tests/questions.test.js`.
- Run one named test with `node --test --test-name-pattern="isCorrect returns true" tests/quiz.test.js`.
- Start the local app with `npm start`, then open `http://localhost:8080`. The server exposes `src/` as its document root.
- There is no lint script or build step in `package.json`.

## Architecture

- The root [index.html](../index.html) redirects GitHub Pages visitors to [src/index.html](../src/index.html), which is the actual quiz page.
- The browser app is intentionally plain JavaScript with no bundler or framework. In [src/index.html](../src/index.html), `questions.js` loads first, `quiz.js` loads second, and `app.js` loads last.
- [src/questions.js](../src/questions.js) supplies the browser-global `QUESTIONS` data and guarded CommonJS export for Node tests.
- [src/quiz.js](../src/quiz.js) contains DOM-free quiz logic (`shuffle`, answer checking, scoring, and grading). Keep browser-independent logic here so it remains directly testable with Node's built-in test runner.
- [src/app.js](../src/app.js) owns UI state, screen visibility, rendering, answer-button event handlers, feedback, and result display. It expects the IDs and screen structure defined in `src/index.html`.
- [tests/quiz.test.js](../tests/quiz.test.js) covers pure quiz behavior; [tests/questions.test.js](../tests/questions.test.js) validates the shape and uniqueness of question data.

## Conventions

- Preserve the script-tag loading order and browser globals. Do not introduce ES module imports or a bundler unless the whole app is deliberately migrated.
- Use the existing guarded `module.exports` pattern when adding exports needed by Node tests; browser execution must continue to work when `module` is unavailable.
- Question answers are zero-based option indexes. Every question has non-empty text, exactly four options, a valid `answer` index, and unique question text.
- Keep UI element IDs and the three-screen flow (`start-screen`, `quiz-screen`, `result-screen`) stable when changing behavior. Screens are switched with the native `hidden` property.
- Keep scoring and grading rules in `quiz.js`; keep DOM updates and event wiring in `app.js`.
- Use the native `node:test` and `node:assert/strict` APIs used by the existing tests rather than adding a test framework.
- The [workshops/](../workshops/) guides describe the intended Copilot workshop workflow and later exercise changes; keep guide content and application behavior aligned when intentionally changing the workshop.
