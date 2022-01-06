# **remote-lab-back**
Back-end of Remote-Lab project.

- [Introduction](#introduction)
- [Filtering](#filtering)
- [Projection](#projection)
- [Features](#features)
  * [Auth](#auth)
    + [Login](#login)
    + [Logout](#logout)
    + [Check Auth](#check-auth)
  * [User](#user)
    + [Create](#create)
    + [Show all](#show-all)
    + [Get by ID](#get-by-id)
    + [Get by Session](#get-by-session)
    + [Update](#update)
    + [Delete](#delete)
  * [CLP Version](#clp-version)
    + [Create](#create-1)
    + [Get All](#get-all)
    + [Get One](#get-one)
    + [Update All](#update-all)
    + [Update One](#update-one)
    + [Delete One](#delete-one)

## Introduction

This is a RESTful web API, made in NodeJs with express.
All requests, on all routes and methods, work with [JSON](https://www.json.org/json-en.html) data and return semantic [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

The API features can be accessed by specific Routes and HTTP methods. Depending on the feature, it's possible (or required) to send data by the `query string` for filtering, or by the `body`. This information will be in the description of each API feature [below](#features).

If the feature description does not mention the optional or mandatory submission of certain data (e.g. query string, body), then that specific feature does not support it and will ignore it if submitted.

## Filtering

In some requests, it's possible to send filtering data to select a specific resource, like in `GET`, `PUT`, and ` DELETE` requests, to point out some specific piece of data to handle.

This is done by sending pairs of **\<field\>**:**\<value\>** in the request's query string. These pairs can filter the database to interact only with the data where **\<field\>** matches with the **\<value\>**.

If the API feature requires a filter to interact with only one piece of data, and there's more than one match for the filter, the API will interact with the first match. Generally, the first match occurs with the oldest data.

## Projection

In some `GET` requests it's possible to set a projection of which data the server should return in the response.

This is done by sending the pair **projection**:**\<value\>** in the request's query string. The **\<value\>** must be a `string` with the field names to be returned, separated by space (`' '`).

If the required field is inside a nested object, [dot notation](https://docs.mongodb.com/manual/core/document/#dot-notation) must be used.

If no projection is provided, the API will return the data with all fields.

## Features

### Auth

Auth routes handle the work related to authentication and authorization.

User sessions are stored server-side, using [express-session](https://github.com/expressjs/session) package and [Redis](https://redis.io/) database as session storage.

#### Login

Authenticates users to the system and sets a client-side session cookie. The user must login with their **username / email** (loginId) and **password**.

- Route: `/auth/login`
- Method: `POST`
- Body Example:
  ```JSON
  {
    "loginId": "mark@gmail.com",
    "password": "5uper_S3cr3t_P4s5"
  }
  ```

#### Logout

Logs out the user out of the system and removes the client-side session cookie.

- Route: `/auth/logout`
- Method: `GET`

#### Check Auth
Verifies whether the current client is authenticated, with an ongoing session. Returns a JSON with boolean value `isAuth` (`false`: not logged, `true`: logged).

- Route: `/auth`
- Method: `GET`
- Return Example:
  ```JSON
  {
    "isAuth": false
  }
  ```

### User

User routes handle work related to user data manipulation.

- **Schema:**
  ```JS
  {
    name: String,
    username: String,
    email: String,
    password: String,
    role:{
      type: String,
      enum: ['MASTER', 'ADMIN', 'USER']
    },
    createdAt: Date
  }
  ```

#### Create

Creates new user.

- Route: `/user`
- Method: `POST`
- Body Example:
  ```JSON
  {
    "name": "John Marston",
    "username": "John73",
    "email": "john.mars@gmail.com",
    "password": "5uper_S3cr3t_P4s5",
    "role": "ADMIN"
  }
  ```

#### Show all

Return all users.

- Route: `/user`
- Method: `GET`


#### Get by ID

Return one user by ID.

- Route: `/user/:id`
- Method: `GET`

#### Get by Session

If there's a session ongoing, return user data from current session. Otherwise, returns Status Code [401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401) (Unauthorized) with an error message.

- Route: `/user/session`
- Method: `GET`

#### Update

Update user data by ID.

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

#### Delete

Delete user by ID.

- Route: `/user/:id`
- Method: `DELETE`


### CLP Version

CLP Version routes handle work related to CLP Versions management.

- **Schema:**
  ```JS
  {
    name: String,
    input:{
      digital: Number,
      analog: Number
    },
    output:{
      digital: Number,
      analog: Number
    },
    createdAt: Date
  }
  ```

#### Create

Creates new CLP version.

- Route: `/clp-version`
- Method: `POST`
- Body: `Mandatory`
  ```JSON
  {
    "name": "Genesis",
    "input":{
      "digital": 5,
      "analog": 3
    },
    "output":{
      "digital": 7
    }
  }
  ```

#### Get All

Returns many CLP versions. A filter can be provided to narrow the results.

- Route: `/clp-version/many`
- Method: `GET`
- Query: **Filter** (`Optional`), **Projection** (`Optional`)

#### Get One

Returns one CLP version, based on provided filter.

- Route: `/clp-version`
- Method: `GET`
- Query: **Filter** (`Mandatory`), **Projection** (`Optional`)

#### Update Many

Update many CLP versions. A filter can be provided to narrow the results.

- Route: `/clp-version/many`
- Method: `PUT`
- Query: **Filter** (`Optional`)
- Body: `Mandatory`
  ```JSON
  {
    "name": "Genesis2",
    "input":{
      "digital": 10
    }
  }
  ```

#### Update One

Update one CLP version, based on provided filter.

- Route: `/clp-version`
- Method: `PUT`
- Query: **Filter** (`Mandatory`)
- Body: `Mandatory`

#### Delete One

Delete one CLP version data, based on provided filter.

- Route: `/clp-version`
- Method: `DELETE`
- Query: **Filter** (`Mandatory`)