var backgroundImgEl = document.querySelector(".hero-image");
var quotePicContainer = document.querySelector('.quotePicContainer');
var quotePicEl = document.querySelector('#quotePicImg');
var backgroundBtn = document.querySelector("#backgroundBtn");
var picQuoteBtn = document.querySelector('#picQuoteButton');
var picContainerEl = document.querySelector('.picContainer')

// A class will randomly be assigned to the quote text
var quoteClass = ['bottom-left', 'top-left', 'top-right', 'bottom-right', 'centered']

//Words that won't be used to search for an image
var exclusionArray = ['and', 'the', 'i', 'you', 'we', 'they', 'im',
'so','them', 'at', 'is', 'not', 'of', 'to', 'from', 'for', 'who', 'what', 'how', 'why', 'where', 'when', 'it', 'its',
'he', 'she', 'a', 'youre', 'your', 'too', 'there', 'their', 'theyre', 'with', 'in', 'do', 'done', 'did',
'our', 'are', 'about', 'that', 'thats', 'who', 'whose', 'mine', 'yours', 'by', 'yes', 'no', 'shit', 'bitch',
'fuck', 'ass', 'whore', 'slut', 'asshole', 'bastard', 'god', 'goddamn', 'goddammit', 'penis', 'vagina', 'pussy',
'dick', 'motherfucker', 'fucker', 'retard', 'retarded', 'fag', 'faggot', 'dyke', 'libtard', 'shitty', 'piss',
'balls', 'bullshit', 'cock', 'cunt', 'tits', 'nuts', 'cocksucker', 'as', 'about', 'than', 'then', 'serve', 'all', 'be'
]


var excludeSource = ['hitler', 'goebbels', 'stalin', 'bolsonaro']

// API keys
var quoteApiArr = ['7c60dc7b45msh2b451cd8e9e818cp154685jsn02718fac91a5', 'bf1a2d4e80msh94bbb945c71633dp1a715cjsnf031a1e266b3',
'0238fd9419msh1a74ae4a30af76fp15d5bejsnaee83c201b23']
var quotei = 2;

var pexelsApiArr = ['563492ad6f9170000100000176391aec0ad4405c9c2d91c6edd1cebb', '563492ad6f91700001000001687d7a81df76457e89cf51ad832280ac']
var pexelsi = 1;

// Fetches data from QuotePark
function fetchQuote() {

    if(quotei === 2){
        quotei = 0;
    } else {
        quotei++;
    }
  fetch("https://quotes15.p.rapidapi.com/quotes/random/", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "quotes15.p.rapidapi.com",
            "x-rapidapi-key": quoteApiArr[quotei]
        }
    })
        .then(quoteResp => {
            return quoteResp.json();
        })
        .then(quoteData => {
            var wordCount = quoteData.content.split(' ');
            var quoteSrc = quoteData.originator.name.toLowerCase().split(' ');

            //Checks to see if the quote is too long or if it originates from someone with... poor character
            if (wordCount.length > 30 || excludeSource.includes(quoteSrc[1])) {

                fetchQuote();
            } else {
                displayQuotePic(quoteData);
            }
        })

}

// Fetches data from Pexels
function fetchPic(quoteData) {
    if(pexelsi === 1) {
        pexelsi = 0;
    } else {
        pexelsi++;
    }



    // Checks to see if you're searching for pic or just want a random pic
    if (quoteData === undefined) {
        fetch("https://api.pexels.com/v1/curated?per_page=15", {
            headers: {
                authorization: pexelsApiArr[pexelsi]
            }
        }).then(picResp => {
            return picResp.json();
        })
            .then(picData => {
                displayBackground(picData);
            })


    } else {
        var word = chooseRandomWord(quoteData.content);
        fetch("https://api.pexels.com/v1/search?query=" + word, {
            headers: {
                authorization: pexelsApiArr[pexelsi]
            }
        })
            .then(picResp => {
                console.log(picResp);
                return picResp.json();
            })
            .then(picData => {
                if (picData.total_results === 0) {
                    fetchPic(quoteData)
                } else {
                    var picLink = picData.photos[getRandomInt(picData.photos.length)].src.original;

                    quotePicEl.setAttribute('src', picLink);
                }
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
    
    fetchPic(quoteData);

    if (picContainerEl.children.length > 1) document.querySelector('#quote').remove();

    var quoteEl = document.createElement('p');
    quoteEl.setAttribute('class', quoteClass[getRandomInt(5)])
    quoteEl.setAttribute('id', 'quote')
    quoteEl.textContent = quoteData.content + ' - ' + quoteData.originator.name;
    picContainerEl.append(quoteEl);

}

function chooseRandomWord(quote) {
    var words = quote.split(' ');
    var randomWord = words[getRandomInt(words.length)].toLowerCase();
    randomWord = randomWord.replace(/[!,....'?':"]/g,"");
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