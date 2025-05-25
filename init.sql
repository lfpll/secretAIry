-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    why TEXT NOT NULL,
    urgency TEXT NOT NULL,
    section TEXT NOT NULL,
    planned_date TEXT,
    completed_at TEXT,
    regularity_type TEXT,
    regularity_days TEXT,
    regularity_every_x_days INTEGER,
    regularity_last_completed TEXT
);

-- Insert sample tasks (active)
INSERT INTO tasks (id, title, why, urgency, section) 
VALUES 
    ('1', 'Call your sister', 'Because family matters and she might need support right now', 'critical', 'active'),
    ('2', 'Meditation', 'To start the day with clarity and reduce anxiety', 'high', 'active'),
    ('3', 'Clean the kitchen', 'A clean space creates mental clarity and makes cooking enjoyable', 'medium', 'active'),
    ('4', 'Read for 30 minutes', 'To expand knowledge and improve mental health through fiction', 'low', 'active'),
    ('5', 'Organize photo album', 'To preserve memories and create something beautiful for the family', 'low', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks (future with planned dates)
INSERT INTO tasks (id, title, why, urgency, section, planned_date) 
VALUES 
    ('6', 'Learn Spanish', 'To connect better with Spanish-speaking colleagues and travel experiences', 'low', 'future', CURRENT_DATE + INTERVAL '5 days'),
    ('7', 'Redecorate living room', 'To create a more inspiring and comfortable space for relaxation', 'low', 'future', CURRENT_DATE + INTERVAL '10 days'),
    ('8', 'Plan summer vacation', 'To create memorable experiences and quality time with family', 'low', 'future', CURRENT_DATE + INTERVAL '3 days'),
    ('9', 'Take cooking class', 'To improve culinary skills and enjoy healthier homemade meals', 'low', 'future', CURRENT_DATE + INTERVAL '8 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks (done with completion dates)
INSERT INTO tasks (id, title, why, urgency, section, completed_at) 
VALUES 
    ('10', 'Morning workout', 'To feel energized and maintain physical health', 'low', 'done', CURRENT_TIMESTAMP),
    ('11', 'Review budget', 'To stay on track with financial goals and reduce money stress', 'low', 'done', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    ('12', 'Plan weekend trip', 'To create quality time with friends and make memories', 'low', 'done', CURRENT_TIMESTAMP - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING; 