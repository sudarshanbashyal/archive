CREATE TABLE users(
  user_id serial primary key not null,
  first_name varchar(20) not null,
  last_name varchar(20) not null,
  email varchar(30) unique not null,
  password text not null,
  interest varchar(45) default null,
  workplace varchar(45) default null,
  bio text default null,
  user_followed integer[] default '{}',
  topics_followed integer[],
  profileImage text default null,
  headerImage text default null
);

CREATE TABLE topics(
    topic_id serial primary key not null,
    topic_title varchar2(20) not null,
    topic_image text not null
);

CREATE TABLE blogs(
    blog_id serial primary key not null,
    title text not null,
    blog_content text not null,
    header_image text not null,
    topic_id integer references topics(topic_id) not null,
    creator_id integer references users(user_id) not null,
    created_at date not null default CURRENT_DATE
);

CREATE TABLE comments(
    comment_id serial primary key not null,
    comment_content text not null,
    creator_id integer users(user_id) not null,
    blog_id integer blogs(blog_id) not null,
    parent_id integer references comments(comment_id)
    created_at date not null default CURRENT_DATE
);

