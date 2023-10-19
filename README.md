# Members Only Project

Message board app where users can write anonymous posts, but only users who join as members can see who the author of a post is. Created using Express (Node.js).

## Features

- Sign up for a basic account
- Can login/logout after making an account
- Users with an account can post messages
- Basic account can be upgraded to member and/or admin status by entering special passwords
- Restrictions on viewing authors of messages and deleting messages based on membership status of account

## Membership Statuses

- No account: can view messages with author hidden
- Basic account: can create messages and view messages with author hidden
- Member status: can create messages, view messages, and see authors of messages
- Admin status: can create messages, view messages, see authors of messages, and delete messages

## Purpose

- To practice using express-session, passport, and passport-local packages to implement user authentication
- Use bcryptjs to encrypt user passwords
- More practice working with a database
