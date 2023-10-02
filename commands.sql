CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    likes integer DEFAULT 0
);

-- Forgot title :)
ALTER TABLE blogs
ADD COLUMN title text NOT NULL;

insert into blogs (author, likes, title, url) values ('Dan Abramov', 0,'Writing Resilient Components', 'https://overreacted.io/writing-resilient-components/');

insert into blogs (author, likes, title, url) values ('Martin Fowler', 0, 'Is High Quality Software Worth the Cost?', 'https://martinfowler.com/articles/is-quality-worth-cost.html');


