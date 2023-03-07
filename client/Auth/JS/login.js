
// if the user is already logged in, redirect to the home page
document.addEventListener('DOMContentLoaded', function () {
    // Check if the user is already logged in
    if (localStorage.getItem('user')) {
      // Redirect the user to the dashboard
      window.location.href = '../index.html';
    }
});


function isValidEmail(email) {
    // regular expression to match email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // test the email against the pattern and return the result
    return emailPattern.test(email);
}


const LoginForm = document.querySelector('#login-form');
LoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // get user info
    const email = LoginForm['login-email'].value;
    const password = LoginForm['login-password'].value;
    // validate the user info
    if (email == '' || password == '') {
        alert('Please enter all the fields');
        return false;
    }
    // validate the email
    if (!isValidEmail(email)) {
        alert('Please enter a valid email');
        return false;
    }
    // check the password length
    if (password.length < 6) {
        alert('Password should be at least 6 characters');
        return false;
    }

    // send the post request to the server
    fetch('http://127.0.0.1:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    }).then((res) => res.json()).then((data) => {
        console.log(data);
        if (data.error) {
            alert(data.error);
        } else {
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = '../index.html';
        }
    });



});