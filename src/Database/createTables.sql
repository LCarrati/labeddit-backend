    -- no PostgreSQL substituir "TEXT DEFAULT (DATETIME('now', 'localtime'))" por "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    -- no PostgreSQL like é uma palavra reservada, então substituir "like integer DEFAULT 0" por  "like" integer DEFAULT 0
    
-- Active: 1686059479208@@127.0.0.1@3306
CREATE TABLE
    users (
        user_id TEXT NOT NULL UNIQUE PRIMARY KEY,
        nickname TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    posts (
        post_id TEXT NOT NULL UNIQUE PRIMARY KEY,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    likes_dislikes (
        user_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        "like" integer DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    comments (
        comment_id TEXT PRIMARY KEY UNIQUE NOT NULL,
        post_id TEXT NOT NULL,
        creator_id TEXT NOT NULL,
        comment TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

drop TABLE comment_likes_dislikes ;
CREATE TABLE
    comment_likes_dislikes (
        user_id TEXT NOT NULL,
        comment_id TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments (comment_id) ON DELETE CASCADE ON UPDATE CASCADE
    );