CREATE TABLE users(
  user_id serial not null,
  first_name varchar(20) not null,
  last_name varchar(20) not null,
  email varchar(30) unique not null,
  password text not null,
  interest varchar2(20) default null,
  workplace varchar2(20) default null,
  bio text default null,
  user_followed integer[],
  topics_followed integer[],
  profileImage text default null,
  headerImage text default null
);

CREATE TABLE topics(
    topic_id serial not null,
    topic_title varchar2(20) not null,
    topic_image text not null
);

CREATE TABLE blogs(
    blog_id serial not null,
    title text not null,
    blog_content text not null,
    header_image text not null,
    topic_id integer references topics(topic_id) not null,
    blog_topic integer not null,
    creator_id interger references users(user_id) not null,
    created_at date not null default CURRENT_DATE
);

CREATE TABLE comments(
    comment_id serial not null,
    comment_content text not null,
    creator_id integer users(user_id) not null,
    blog_id integer blogs(blog_id) not null,
    parent_id integer references comments(comment_id)
    created_at date not null default CURRENT_DATE
);