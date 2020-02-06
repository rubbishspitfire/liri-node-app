require("dotenv").config();
var keys = require("./keys");
var inquirer = require('inquirer');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require("fs");
var request = require("request");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

inquirer.prompt([
    {
        type: "list",
        name: "userChoice",
        message: "Hello Patience, this is Liri. What can I help you with?",
        choices: ["Seach Twitter", "Get Spotify",  "Search movie", "Call mom"]
    },
    {
        type: "input",
        name: "searchQuery",
        message: "What can I help you?"
    },

]).then(function(response) {
    var response = response;
    if (response.userChoice === "Movie info") {
        var queryUrl = ("http://www.omdbapi.com/?t=underworld&y=&plot=short&apikey=trilogy").then(
            function(response) {
                console.log("The movie's rating is: " + response.data.imdbRating);
        })
        .catch(function(error) {
            if (error.response) {
     console.log("---------------Data---------------");
      console.log(error.response.data);
      console.log("---------------Status---------------");
      console.log(error.response.status);
      console.log("---------------Status---------------");
      console.log(error.response.headers);
    } else if (error.request) {
        console.log(error.request);
    } else {
        console.log("Error", error.message);
    }
    console.log(error.config);
           
    });
       
        request(queryUrl, function (error, repsonse, body) {
            if (!error && response.statusCode === 200) {
                var data = JSON.parse(body);
                var ratingText = '';
                var ratings = data.Ratings.filter(function (rating) {
                    var notMetacritic = rating.Source !== "Metacritic";
                    if (notMetacritic) {
                        ratingText += rating.Source + ':' + rating.Value + "\n"
                    }
                    return notMetacritic;
                });

                console.log("Title: " + data.Title + "\nRelease Year: " + data.Year + "\nCountry: "+ ratingText + data.Country + "\nLanguage: " + data.Language + "\nPlot " + data.Plot + "\nActors: "+ data.Actors);

            }
        });
    }
    if(response.userChoice === "Search Twitter") {
        client.get('search/tweets', {q: response.searchQuery}, function(error, tweers, response) {
            var statuses = tweets.statuses.map(function(tweet){return tweet.text});
            console.log(statuses);

        });

    }
    if(response.userChoice === "Get song info" {
        spotify
        .search({ type: 'track', query: response.searchQuery })
        .then(function(resp) {

            for (let i = 0; i < resp.tracks.items.lenngth; i++) {
                let track = resp.tracks.items[i].name
                let songUrl =resp.tracks.items[i].href
                let albumName = resp.tracks.items[i].album.name
                let artists = []
                for(let j = 0; j < resp.tracks.items[i].artist.length; j++) {
                    let artistName = resp.tracks.items[i].artists[j].name
                    artists.push(artistName)

                }
                console.log(`${i + 1}
        ${artists.join(",")}
        ${track}
        ${songUrl}
        ${albumName}
        `)
            
                }
        })
        .catch(function(err) {
            console.log(err);
        });
    }
});