// THESE ARE EXAMPLES ONLY! THIS IS NOT A FUNCTIONAL FILE

// Import axios for making the calll
  const axios = require('axios');

// Define user details used for registration
  var username = 'example@domain.com';
  var password = 'S3curePassw0rd1';
  var name = 'Test User';
  var token = '';

// REGISTER USER
  axios.post('https://localhost:3000/register', { username, password, name })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log('There was an error during registration: ' + error);
    });

// LOGIN to get JWT/Authorization Token
  axios.post('https://localhost:3000/login', { username, password })
    .then((result) => {
      console.log(result.data.token);
    })
    .catch((error) => {
      if(error.response.status === 401) {
        console.log('Login failed. Username or password not match');
      } else {
        console.log('There was a problem logging in: ' + error);
      }
    });

// GET ALL USERS
  axios.defaults.headers.common['Authorization'] = token; //THIS IS REQUIRED
  axios.get('https://localhost:3000/users')
    .then(res => {
      console.log(res.data);
    })
    .catch((error) => {
      if(error.response.status === 401) {
        console.log('Request not authorized');
      } else {
        console.log('There was a problem with your request: ' + error);
      }
    });
