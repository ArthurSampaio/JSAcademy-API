# Javascript Academy - Backend
This  document describe technical aspects of JS Academy's backend like api rest, models, technical decisions and other architectural aspects.


## Table of Contents
- [Usage](#usage)
- [API Rest](#api-rest)
  - [Resources](#resources)


## Usage
Make sure you have [Node](https://nodejs.org) version 9.x and [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) version 3.x installed.

`npm install`

Now, before running the app, start MongoDB:

`sudo service mongod start`

And add a secret to .env:

`echo SECRET=123 > .env`

Run the app:

`npm start`


## API Rest

This API was build using the MEAN Stack and the API Rest concept to build our business logic. To know how API Rest works [see here.](https://medium.com/@lazlojuly/what-is-a-restful-api-fabb8dc2afeb).

### Resources

Resources to query and manipulate the entities of JS Academy server are describe in this content. Each resources has a set of actions(endpoints) and describe them individual with their constraints and responses.

- [User:](/api/user') `/api/user'`