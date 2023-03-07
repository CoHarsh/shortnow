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



const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const name = signupForm['signup-name'].value;

    console.log(email, password);

    // validate the user info
    if (email == '' || password == '' || name == '') {
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

    // check the name length
    if (name.length < 3) {
        alert('Name should be at least 3 characters');
        return false;
    }

    // send the post request to the server
    fetch('http://127.0.0.1:3000/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            name,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.error) {
                alert(data.error);
            } else {
                console.log(data);
                //set the token in the local storage
                // set the cookie
                document.cookie = `token=${data.token}`;
                localStorage.setItem('token', data.token);
                //store the user object in the local storage
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = '../index.html';
            }
        });

    // clear the form
    signupForm.reset();

    // prevent the default behaviour of the form why do i need this?
    // dont erase the content into the console

    return false;
    


    
    
});

