
renderQuotes();

function renderQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(quotes => {
        console.log(quotes);
        displayQuotes(quotes);

    })
    .catch(error => console.log(error));
}

function displayQuotes(quotes) {
    const ulQuotes = document.getElementById('quote-list');
    ulQuotes.innerHTML = '';
    quotes.forEach(quote => {
        const liQuote = document.createElement('li');
        liQuote.className = 'quote-card';
        const bqQuote = document.createElement('blockquote');
        bqQuote.className = 'blockquote';
        const pQuote = document.createElement('p');
        pQuote.textContent = quote.quote;
        pQuote.className = 'mb-0';
        const ftrQuote = document.createElement('footer');
        ftrQuote.textContent = quote.author;
        ftrQuote.className = 'blockquote-footer';
        const brQuote = document.createElement('br');
        const btnLikes = document.createElement('button');
        btnLikes.textContent = 'Likes: '
        btnLikes.className = 'btn-success';
        const spanLikes = document.createElement('span');
        spanLikes.textContent = quote.likes.length.toString();
        btnLikes.appendChild(spanLikes);
        btnLikes.addEventListener('click', e => onClickLikes(e));
        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Delete';
        btnDelete.className = 'btn-danger';
        btnDelete.addEventListener('click', e => onClickDelete(e));
        bqQuote.append(pQuote, ftrQuote, brQuote, btnLikes, btnDelete)
        const pId = document.createElement('p');
        pId.textContent = quote.id;
        pId.hidden = true;
        liQuote.append(bqQuote, pId);
        ulQuotes.appendChild(liQuote);
    });
}

function onClickDelete(e) {
    console.log(e.target.parentNode.parentNode.children[1].textContent);
    const idQuote = e.target.parentNode.parentNode.children[1].textContent;
    fetch(`http://localhost:3000/quotes/${idQuote}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'applicatioin/json',
        }
    })
    .then(resp => resp.json())
    .then(quote => {
        console.log(quote);
        renderQuotes();
    })
    .catch(error => console.log(error));
}

function onClickLikes(e) {
    // needs to work on this.
    console.log(e.target.parentNode.parentNode.children[1].textContent);
    const idQuote = parseInt(e.target.parentNode.parentNode.children[1].textContent, 10);
    const curTime = Math.round(Date.now() / 1000);
    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            quoteId: idQuote,
            createdAt: curTime,
        }),
    })
    .then(resp => resp.json())
    .then(like => {
        console.log(like);
        renderQuotes();
    })
    .catch(error => console.log(error));
}

const frmNewQuote = document.getElementById('new-quote-form');
frmNewQuote.addEventListener('submit', e => {
    e.preventDefault();

    const newQuoteInputs = document.querySelectorAll('#new-quote-form .form-group');
    //console.log(newQuoteInputs);
    const newQuote = newQuoteInputs[0].lastElementChild.value;
    const newAuthor = newQuoteInputs[1].lastElementChild.value;
    fetch(`http://localhost:3000/quotes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor,
        }),
    })
    .then(resp => resp.json())
    .then(quote => {
        console.log(quote);
        renderQuotes();
    })
    .catch(error => console.log(error));

    e.target.reset();
});
