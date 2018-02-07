
require("dotenv").config();
var keys = require("./keys.js");

//twitter API setup//
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
//spotify API setup//
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Globally declared variables
var nodeArgs = process.argv;
var command = process.argv[2];;
var request = require("request");
var fs = require("fs");

// Creates the initial log.txt file, records and appends each succeeding command line argument
fs.appendFile('log.txt', "--> " + nodeArgs.slice(2).toString() + "\n", function(err) {
    if (err) {
        console.log("ERROR");
    } else {
        console.log("Content added to log");
    }
})

// Switch/Case takes input from command line and calls functions.

switch (command) {

    case "my-tweets":
        runTwitter();
        break;

    case "spotify-this-song":
        runSpotify();
        break;

    case "movie-this":
        runOMDB();
        break;

    case "do-what-it-says":
        fooBar();
        break;
}


// Functions.
function runTwitter() {
    var params = {screen_name: 'tikeka11'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i++) {
                console.log("============================================");
                console.log("\nTweet text: " + tweets[i].text);
                console.log("\nTweet created: " + tweets[i].created_at);
                console.log("\n============================================");
            }
        }
    });
}


function runSpotify() {
    var songName = "";
    for (i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            songName = songName + "+" + nodeArgs[i];
        } else {
            songName += nodeArgs[i];
        }
    }

    spotify.search({ type: 'track', query: songName, limit: 1}, function(err, data) {

        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var mainPath = data.tracks.items[0];
        var artistPath = JSON.stringify(mainPath.album.artists[0].name, null, 2);
        var songPath = JSON.stringify(mainPath.name);
        var albumPath = JSON.stringify(mainPath.album.name);
        var previewPath = JSON.stringify(mainPath.preview_url);

        console.log("\n============================================\n");
        console.log("\nTrack title: " + songPath);
        console.log("\nArtist: " + artistPath);
        console.log("\nAlbum: " + albumPath);
        console.log("\nSpotify preview: " + previewPath);
        console.log("\n============================================\n");
    });
}

// OMDB//
function runOMDB() {
    var movieName = "";
    for (i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            movieName = movieName + "+" + nodeArgs[i];
        } else {
            movieName += nodeArgs[i];
        }
    }

    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryURL, function(error, response, body) {

        var data = JSON.parse(body);

        console.log("\n============================================\n");
        console.log("\nTitle: " + data.Title);
        console.log("\nRelease date: " + data.Released);
        console.log("\nIMDB rating: " + data.Ratings[0].Value);
        console.log("\nRotten Tomatoes rating: " + data.Ratings[1].Value);
        console.log("\nCountry: " + data.Country);
        console.log("\nLanguage: " + data.Language);
        console.log("\nPlot summary: " + data.Plot);
        console.log("\nStarring: " + data.Actors);
        console.log("\n============================================\n");
    })
}

    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }

        var dataArr = data.split(',');
        var songName = dataArr[1];

        spotify.search({ type: 'track', query: songName, limit: 1}, function(err, data) {

            if (err) {
                return console.log('Error occurred: ' + err);
            }

            var mainPath = data.tracks.items[0];
            var artistPath = JSON.stringify(mainPath.album.artists[0].name, null, 2);
            var songPath = JSON.stringify(mainPath.name);
            var albumPath = JSON.stringify(mainPath.album.name);
            var previewPath = JSON.stringify(mainPath.preview_url);

            console.log("\n============================================\n");
            console.log("\nTrack title: " + songPath);
            console.log("\nArtist: " + artistPath);
            console.log("\nAlbum: " + albumPath);
            console.log("\nSpotify preview: " + previewPath);
            console.log("\n============================================\n");
        });
    })
}
