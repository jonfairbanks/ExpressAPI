# ExpressAPI
An Express/MongoDB based rest API with Passport token authentication.

## Prerequesites
* MongoDB instance

## Deployment

* #### Install dependencies
`yarn install`

* #### Start Server
`MONGO_URI='mongodb://user:pass@hostname:27017/db' yarn start`

* #### Validate
Navigate to http://hostname:3000/ and confirm you receive the below resposne:
> {"message":"Connected!"}

## Usage
_ You must first register, then login to receive the token which you can then use for the other endpoints. You only need to call login with user/pass if already registered._

### Get Authentication Token

* #### Register a new user
POST `{name: nameVALUE, username: userVALUE, password: passVALUE}` to `/auth/register`

* #### Login to get authentication token
POST `{username: userVALUE, password: passVALUE}` to `/auth/login`
>_Save the token from the response object `{token}` as it will be needed for all other api calls_

### User object API
_This API requires you to set header: authorization for each request to the JWT token received from 'login'_

* #### Get a list of users
GET `/users`

* #### Get user by userID
GET `/users/:userID`

* #### Update a user by userID
POST `/users/:userID`

* #### Delete a user  by userID
DELETE `/users/:userID`
