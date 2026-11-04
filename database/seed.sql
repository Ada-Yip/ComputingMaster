TRUNCATE attempt_details, attempts, questions, users RESTART IDENTITY CASCADE;

INSERT INTO users (username, userpw, userType) VALUES
('student1', '$2b$10$abcdefghijklmnopqrstuv', 'student'),
('student2', '$2b$10$abcdefghijklmnopqrstuv', 'student'),
('teacher1', '$2b$10$abcdefghijklmnopqrstuv', 'teacher');
-- userpw = password123 (hashed)


INSERT INTO questions (topic, question_text, options, answer, explanation) VALUES
('Web', 
 'Which HTML5 tag is used to define independent, self-contained content like a blog post or a news article?', 
 '{"A": "<section>", "B": "<article>", "C": "<div>", "D": "<aside>"}', 
 'B', 
 'The <article> tag specifies independent, self-contained content. A <section> is a thematic grouping, and a <div> is a generic container.');

INSERT INTO questions (topic, question_text, options, answer, explanation) VALUES
('Web', 
 'Which CSS property is used to create a flexible layout that arranges items in a row or column?', 
 '{"A": "display: block", "B": "display: inline", "C": "display: flex", "D": "display: table"}', 
 'C', 
 'Setting display: flex enables the Flexbox layout model, which allows items to be arranged in a row or column with flexible sizing.');

INSERT INTO questions (topic, question_text, options, answer, explanation) VALUES
('Web', 
 'Which of the following methods is used to add an event listener to a DOM element?', 
 '{"A": "element.addEvent()", "B": "element.addEventListener()", "C": "element.onEvent()", "D": "element.attachEvent()"}', 
 'B', 
 'element.addEventListener() is the standard modern way to attach an event handler. attachEvent is deprecated and only worked in old versions of IE.');

INSERT INTO questions (topic, question_text, options, answer, explanation) VALUES
('Web', 
 'In an Express.js application, which method is used to define a route that handles HTTP GET requests?', 
 '{"A": "app.post()", "B": "app.get()", "C": "app.route()", "D": "app.use()"}', 
 'B', 
 'app.get() is the Express method for handling GET requests. app.post() handles POST, and app.use() is for middleware.');


INSERT INTO attempts (uid, score, total_questions, created_at) VALUES
(1, 3, 4, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(1, 4, 4, CURRENT_TIMESTAMP);


INSERT INTO attempt_details (aid, qid, selected_answer, is_correct) VALUES
(1, 1, 'B', TRUE),
(1, 2, 'C', TRUE),
(1, 3, 'A', FALSE),  -- correct answer is B
(1, 4, 'B', TRUE);

INSERT INTO attempt_details (aid, qid, selected_answer, is_correct) VALUES
(2, 1, 'B', TRUE),
(2, 2, 'C', TRUE),
(2, 3, 'B', TRUE),
(2, 4, 'B', TRUE);