## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## End points

#### `Signup`
```
POST /signup
{
  "name": "",
  "email": "",
  "password": "",
  "phone": ""
}

response
{
  user,
  token: jwt 
}

```

#### `Signin`
```
POST /signin
{
  "email": "",
  "password": ""
}

response
{
  user,
  token: jwt 
}

```
#### `User Profile`
```
GET /profile
header : {
  Authorization: Bearer ${token}
}

response
{
  ...user
}

```

#### `Update Profile`
```
PUT /profile
header : {
  Authorization: Bearer ${token}
}

data: {
  "name": "",
  "email": "",
  "password": "",
  "phone": ""
}

response
{
  ...user
}

```

#### `Users list`
```
GET /users
header : {
  Authorization: Bearer ${token}
}

response
[
  users
]

```

#### `Create new User`
```
POST /users
header : {
  Authorization: Bearer ${token}
}

data: {
  "name": "",
  "email": "",
  "password": "",
  "phone": ""
}

response
{
   _id: "",
  ...user
}

```


#### `Update User`
```
PUT /users/:id
header : {
  Authorization: Bearer ${token}
}

data: {
  "name": "",
  "email": "",
  "password": "",
  "phone": ""
}

response
{
   _id: "",
  ...user
}
```

#### `Delete User`
```
DELETE /users/:id
header : {
  Authorization: Bearer ${token}
}

response
{
}

```

## License

Nest is [MIT licensed](LICENSE).
