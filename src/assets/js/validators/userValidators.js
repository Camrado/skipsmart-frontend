let isUsernameValid = false;

function usernameValidator(rule, value, callback) {
  if (!value) {
    isUsernameValid = false;
    callback(new Error('Username field is required'));
  } else {
    isUsernameValid = true;
    callback();
  }
}

let isPasswordValid = false;

function passwordValidator(rule, value, callback) {
  if (!value) {
    isPasswordValid = false;
    callback(new Error('Password field is required'));
  } else {
    isPasswordValid = true;
    callback();
  }
}

export { isUsernameValid, usernameValidator, isPasswordValid, passwordValidator };
