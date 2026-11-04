-- 1. Users: Storing student and teacher accounts' information
CREATE TABLE users (
    uid SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    userpw VARCHAR(255) NOT NULL,
    userType VARCHAR(20) DEFAULT 'student' CHECK (userType IN ('student', 'teacher'))
);

-- 2. Questions: Storing MCQ data
CREATE TABLE questions (
    qid SERIAL PRIMARY KEY,
    topic VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, 
    answer VARCHAR(10) NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Attempts: Records a user's practice question set
CREATE TABLE attempts (
    aid SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

-- 4. Attempt_Details: Records individual answers within an attempt
CREATE TABLE attempt_details (
    adid SERIAL PRIMARY KEY,
    aid INT NOT NULL,
    qid INT NOT NULL,
    selected_answer VARCHAR(10) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    CONSTRAINT fk_attempt FOREIGN KEY (aid) REFERENCES attempts(aid) ON DELETE CASCADE,
    CONSTRAINT fk_question FOREIGN KEY (qid) REFERENCES questions(qid) ON DELETE CASCADE
);


CREATE INDEX idx_attempts_uid ON attempts(uid);
CREATE INDEX idx_questions_topic ON questions(topic);
CREATE INDEX idx_attempt_details_aid ON attempt_details(aid);