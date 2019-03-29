# User

## Represent the User's entity

### GET | /api/user/

Get the list of all users in the system.

| Auth Resquested | Succes Response | Error Response |
| `No` | `OK` - 200 | `BAD REQUEST` - 400|

### GET | /api/user/search

- Get a user passing search parameters
- Return a promise with the user

| Auth Resquested | Succes Response | Error Response      |
| --------------- | --------------- | ------------------- |
| `No`            | `OK` - 200      | `BAD REQUEST` - 400 |

### GET /api/user/:userId

- Get the user that has the given ID.
- Return a Promise with the user.

| Auth Resquested | Succes Response | Error Response      |
| --------------- | --------------- | ------------------- |
| `No`            | `OK` - 200      | `BAD REQUEST` - 400 |

### POST /api/user

- Create a new user.
- Return a promise with the new user
- 
| Auth Resquested | Succes Response | Error Response      |
| --------------- | --------------- | ------------------- |
| `No`            | `OK` - 200      | `BAD REQUEST` - 400 |

### PUT /api/user/:userId

- Update an existing user.
- Promise with the updated user.

| Auth Resquested | Succes Response | Error Response      |
| --------------- | --------------- | ------------------- |
| `No`            | `OK` - 200      | `BAD REQUEST` - 400 |

### DELETE /api/user/:userId

- Delete the user that has the given ID.
- Returns a promise with the result of the operation.

| Auth Resquested | Succes Response | Error Response      |
| --------------- | --------------- | ------------------- |
| `No`            | `OK` - 200      | `BAD REQUEST` - 400 |
