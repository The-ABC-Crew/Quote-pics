var backgroundImgEl = document.querySelector(".hero-image");
var quotePicContainer = document.querySelector('.quotePicContainer');
var quotePicEl = document.querySelector('#quotePicImg');
var backgroundBtn = document.querySelector("#backgroundBtn");
var picQuoteBtn = document.querySelector('#picQuoteButton');
var picContainerEl = document.querySelector('.picContainer')

var exclusionArray = ['and', 'the', 'i', 'you', 'we', 'they', 
'them', 'at', 'is', 'not', 'of', 'to', 'from', 'for', 'who', 'what', 'how', 'why', 'where', 'when', 'it', 'it\'s',
'he', 'she', 'a', 'you\'re', 'your', 'too', 'there', 'their', 'they\'re', 'with', 'in', 'do', 'done', 'did',
'our', 'are', 'about', 'that', 'that\'s', 'who', 'whose', 'mine', 'yours', 'by', 'yes', 'no', 'shit', 'bitch',
'fuck', 'ass', 'whore', 'slut', 'asshole', 'bastard', 'god', 'goddamn', 'goddammit', 'penis', 'vagina', 'pussy',
'dick', 'motherfucker', 'fucker', 'retard', 'retarded', 'fag', 'faggot', 'dyke', 'libtard', 'shitty', 'piss',
'balls', 'bullshit', 'cock', 'cunt', 'tits', 'nuts', 'cocksucker', 'as', 'about', 'than', 'then', 'serve', 'all', 'be'
]


// Fetches data from QuotePark
function fetchQuote() {

    fetch("https://quotes15.p.rapidapi.com/quotes/random/", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "quotes15.p.rapidapi.com",
            "x-rapidapi-key": "7c60dc7b45msh2b451cd8e9e818cp154685jsn02718fac91a5"
        }
    })
        .then(quoteResp => {
            return quoteResp.json();
        })
        .then(quoteData => {
            var wordCount = quoteData.content.split(' ');
            if (wordCount.length > 30) {
                fetchQuote();
            } else {
                displayQuotePic(quoteData);
            }
        })

}

// Fetches data from Pexels
function fetchPic(term) {


    // Checks to see if you're searching for pic or just want a random pic
    if (term === undefined) {
        fetch("https://api.pexels.com/v1/curated?per_page=15", {
            headers: {
                authorization: "563492ad6f91700001000001687d7a81df76457e89cf51ad832280ac"
            }
        }).then(picResp => {
            return picResp.json();
        })
            .then(picData => {
                displayBackground(picData);
            })


    } else {
        fetch("https://api.pexels.com/v1/search?query=" + term, {
            headers: {
                authorization: "563492ad6f91700001000001687d7a81df76457e89cf51ad832280ac"
            }
        })
            .then(picResp => {
                console.log(picResp);
                return picResp.json();
            })
            .then(picData => {
                var picLink = picData.photos[0].src.original;
                quotePicEl.setAttribute('src', picLink);
            })
    }
}

// .catch(err => {
//     console.error(err);
// });


// Displays new image from fetched data
function displayBackground(picData) {
    var picLink = picData.photos[getRandomInt(15)].src.original;
    backgroundImgEl.style.setProperty('background-image', 'url(' + picLink + ')');
}

// Makes a random number based on the input
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Displays quote pic
function displayQuotePic(quoteData) {
    console.log(quoteData);
    console.log(quoteData.content + ' - ' + quoteData.originator.name);

    var word = chooseRandomWord(quoteData.content);

    fetchPic(word);

    if(picContainerEl.children.length > 1) document.querySelector('#quote').remove();

    var quoteEl = document.createElement('p');
    quoteEl.setAttribute('class', 'centered')
    quoteEl.setAttribute('id', 'quote')
    quoteEl.textContent = quoteData.content + ' - ' + quoteData.originator.name;
    picContainerEl.append(quoteEl);

}

function chooseRandomWord(quote) {
    var words = quote.split(' ');
    var randomWord = words[getRandomInt(words.length)].toLowerCase();
    randomWord = randomWord.replace(/[!,.?'"]/g,"");
    for(var i = 0 ; i < exclusionArray.length ; i++){
        if(randomWord === exclusionArray[i]) randomWord = chooseRandomWord(quote);
    }
    return randomWord;
}

// Event Listeners
backgroundBtn.addEventListener('click', function (event) {
    event.preventDefault();
    displayBackground(fetchPic());
})

picQuoteBtn.addEventListener('click', function (event) {
    event.preventDefault();
    fetchQuote();
})