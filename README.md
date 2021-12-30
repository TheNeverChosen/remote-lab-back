# **remote-lab-back**
Back-end of Remote-Lab project.

- [**remote-lab-back**](#--remote-lab-back--)
  * [Auth](#auth)
    + [Login](#login)
    + [Check Auth](#check-auth)
    + [Logout](#logout)
  * [User](#user)
    + [Create](#create)
    + [Show all](#show-all)
    + [Show by ID](#show-by-id)
    + [Update](#update)
    + [Delete](#delete)

This is a restful web API, made in NodeJs with express.
All requests, on all routes and methods, work with [JSON](https://www.json.org/json-en.html) data and return semantic [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

## Auth

Auth routes handle the work related to authentication and authorization.

User sessions are stored server-side, using [express-session](https://github.com/expressjs/session) package and [Redis](https://redis.io/) database as session storage.

### Login

Authenticates users to the system and sets a client-side session cookie. The user must login with their **username/email** (loginId) and **password**.

- Route: `/auth/login`
- Method: `POST`

- Payload Example:
  ```JSON
  {
    "loginId": "markup@gmail.com",
    "password": "5uper_S3cr3t_P4s5"
  }
  ```

### Logout

Logs out the user out of the system and removes the client-side session cookie.

- Route: `/auth/logout`
- Method: `GET`

### Check Auth
Verifies whether the current client is authenticated, with an ongoing session. Returns a JSON with boolean value `isAuth` (`false`: not logged, `true`: logged).

- Route: `/auth`
- Method: `GET`
- Return Example:
  ```JSON
  {
    "isAuth": false
  }
  ```

## User

User routes handle work related to user data manipulation.

### Create

Creates new user.

- Route: `/user`
- Method: `POST`
- Payload Example:
  ```JSON
  {
    "name": "Marie Hoffman",
    "username": "marie97",
    "email": "marie@gmail.com",
    "password": "5uper_S3cr3t_P4s5",
    "role": "USER"
  }
  ```

### Show all

Return all users.

- Route: `/user`
- Method: `GET`


### Show by ID

Return one user by ID.

- Route: `/user/:id`
- Method: `GET`

### Update

Update user data by ID. All data can be updated with the exception of user ID and creation date.

- Route: `/user/:id`
- Method: `PUT`
- Payload Example:
  ```JSON
  {
    "name": "Just Marie",
    "username": "NewMarie97",
    "password": "PassT35t@457"
  }
  ```

### Delete

Delete user by ID.

- Route: `/user/:id`
- Method: `DELETE`