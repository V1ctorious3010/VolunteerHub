DELETE FROM users;


INSERT INTO users (name, email, password_hash, role)
VALUES
    ('Nguyen Van A', 'volunteer@example.com', '$2a$10$D9mE5rkbVjYvTnZKGH7c2u7K3bCqDwr/6PSwYugV1sHRhH9Bwhp8G', 'ROLE_VOLUNTEER'),
    ('Tran Thi B',   'manager@example.com',   '$2a$10$D9mE5rkbVjYvTnZKGH7c2u7K3bCqDwr/6PSwYugV1sHRhH9Bwhp8G', 'ROLE_MANAGER');
