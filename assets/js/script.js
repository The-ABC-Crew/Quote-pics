var backgroundImgEl = document.querySelector(".hero-image");
var backgroundBtn = document.querySelector("#backgroundBtn");


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
            console.log(quoteResp);
            return quoteResp.json();
        })
        .then(quoteData => {
            console.log(quoteData);
        })

}

//fetch data from 


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
                displayBackground(picData);
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

// Event Listeners
backgroundBtn.addEventListener('click', function (event) {
    event.preventDefault();
    displayBackground(fetchPic());
})