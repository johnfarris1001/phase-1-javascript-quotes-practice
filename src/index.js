const quoteURL = 'http://localhost:3000/quotes'
const likesURL = 'http://localhost:3000/likes'
let likesCounter = {}

document.addEventListener('DOMContentLoaded', () => {
    fetch(quoteURL)
        .then(resp => resp.json())
        .then(data => renderQuotes(data))

    fetch(likesURL)
        .then(resp => resp.json())
        .then(data => renderLikes(data))

    const form = document.getElementById('new-quote-form')
    form.addEventListener('submit', event => {
        event.preventDefault()
        const quote = document.getElementById('new-quote')
        const author = document.getElementById('author')
        addQuote(quote.value, author.value)
        quote.value = ''
        author.value = ''
    })
})

function renderQuotes(quotes) {
    quotes.forEach(element => {
        renderQuote(element)
    });
}

function renderQuote(quote) {
    const ul = document.getElementById('quote-list')

    const li = document.createElement('li')
    const blockquote = document.createElement('blockquote')
    const p = document.createElement('p')
    const footer = document.createElement('footer')
    const br = document.createElement('br')
    const btnSuccess = document.createElement('button')
    const span = document.createElement('span')
    const btnDanger = document.createElement('button')

    likesCounter[quote.id] = 0

    li.className = 'quote-card'
    li.id = `li-${quote.id}`
    blockquote.className = 'blockquote'
    p.className = 'mb-0'
    p.textContent = quote.quote
    footer.className = 'blockquote-footer'
    footer.textContent = quote.author
    btnSuccess.className = 'btn-success'
    btnSuccess.textContent = 'Likes: '
    span.textContent = likesCounter[quote.id]
    span.id = `likes-${quote.id}`
    btnDanger.className = 'btn-danger'
    btnDanger.textContent = 'Delete'
    btnDanger.id = `quote-${quote.id}`

    btnSuccess.addEventListener('click', () => {
        const likesObj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                quoteId: quote.id
            })
        }

        fetch(likesURL, likesObj)
            .then(resp => resp.json())
            .then(data => addLike(data))
    })

    btnDanger.addEventListener('click', () => {
        fetch(`${quoteURL}/${quote.id}`, { method: 'DELETE' })
            .then(resp => resp.json())
            .then(() => document.getElementById(`li-${quote.id}`).remove())
    })

    li.appendChild(blockquote)
    blockquote.appendChild(p)
    blockquote.appendChild(footer)
    blockquote.appendChild(br)
    blockquote.appendChild(btnSuccess)
    btnSuccess.appendChild(span)
    blockquote.appendChild(btnDanger)
    ul.appendChild(li)
}

function addQuote(quote, author) {
    const quoteObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            quote,
            author
        })
    }

    fetch(quoteURL, quoteObj)
        .then(resp => resp.json())
        .then(data => renderQuote(data))
}

function renderLikes(likes) {
    likes.forEach(element => {
        likesCounter[element.quoteId] += 1
        const span = document.getElementById(`likes-${element.quoteId}`)
        span.textContent = likesCounter[element.quoteId]
    })
}

function addLike(like) {
    likesCounter[like.quoteId] += 1
    const span = document.getElementById(`likes-${like.quoteId}`)
    span.textContent = likesCounter[like.quoteId]
}