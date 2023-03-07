// send POST request by accessing the link in the id=url form field and send it to localhost:3000/shorten
// and then display the shortened url in the id=shortened form field

// Path: client\index.js
// send POST request by accessing the link in the id=url form field and send it to localhost:3000/shorturl

// Path: client\index.js

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