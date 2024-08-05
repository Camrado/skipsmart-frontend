let isFirstNameValid = false;

function firstNameValidator(rule, value, callback) {
  if (!value) {
    isFirstNameValid = false;
    callback(new Error('First name field is required'));
  } else if (value.includes('@')) {
    isFirstNameValid = false;
    callback(new Error('Please fill your fist name not the email'));
  } else if (value.length < 3) {
    isFirstNameValid = false;
    callback(new Error('First name must be at least 3 characters'));
  } else {
    isFirstNameValid = true;
    callback();
  }
}

let isLastNameValid = false;

function lastNameValidator(rule, value, callback) {
  if (!value) {
    isLastNameValid = false;
    callback(new Error('Last name field is required'));
  } else if (value.includes('@')) {
    isLastNameValid = false;
    callback(new Error('Please fill your last name not the email'));
  } else if (value.length < 5) {
    isLastNameValid = false;
    callback(new Error('Last name must be at least 5 characters'));
  } else {
    isLastNameValid = true;
    callback();
  }
}

let isEmailValid = false;

function ufazEmailValidator(rule, value, callback) {
  if (!value) {
    isEmailValid = false;
    callback(new Error('Email field is required'));
  } else if (!value.endsWith('@ufaz.az')) {
    isEmailValid = false;
    callback(new Error('Please provide valid ufaz email with @ufaz.az'));
  } else if (value.length < 12) {
    isEmailValid = false;
    callback(new Error('Email must be at least 12 characters'));
  } else {
    isEmailValid = true;
    callback();
  }
}

let isPasswordValid = false;

function passwordValidator(rule, value, callback) {
  if (!value) {
    isPasswordValid = false;
    callback(new Error('Password field is required'));
  } else if (value.length < 8) {
    isEmailValid = false;
    callback(new Error('Password must be at least 8 characters'));
  } else {
    isPasswordValid = true;
    callback();
  }
}

export {
  isFirstNameValid,
  isLastNameValid,
  firstNameValidator,
  lastNameValidator,
  isPasswordValid,
  passwordValidator,
  ufazEmailValidator,
  isEmailValid
};
