
const userdata = JSON.parse(localStorage.getItem('user'));
if(!userdata){
    window.location.href = './Auth/login.html';
}

const url = document.getElementById('url');
const shortened = document.getElementById('short-url');

const shorten = document.getElementById('shorten');

shorten.addEventListener('click', (e) => {
    e.preventDefault();
    const longurl = url.value;
    console.log(longurl);
    fetch('http://127.0.0.1:3000/shorturl', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longurl }),
    })
        .then((res) => res.json())
        .then((data) => {
            shortened.value = data.shorturl;
        });
});

// click to copy button
const copy = document.getElementById('copy-btn');
copy.addEventListener('click', () => {
    shortened.select();
    document.execCommand('copy');
});


// retrive the localstorage data if exist and print it in the console
const user = JSON.parse(localStorage.getItem('user'));
console.log(user);