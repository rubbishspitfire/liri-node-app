require("dotenv").config();

var keys = require("./keys")

var moment = require("moment")
moment().format()

var Spotify = require('node-spotify-api');

var axios = require("axios")

var fs = require("fs");


// bandsintown
var getBand = function(artist){
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function(response){
      var concertDate = response.data[0].datetime;
      
      var concertInfo =
            `
      ============================================       
      Venue: ${response.data[0].venue.name}
      Venue Location: ${response.data[0].venue.city}, ${response.data[0].venue.country}
      date of the Event: ${moment(concertDate).format('dddd, MMMM Do YYYY, h:mm:ss a')}
      ============================================`

      logtxt("CONCERT SEARCHED: "+ artist + concertInfo)
    //   console.log(concertInfo);
    })
}

// spotify

var getArtistNames = function(artist) {
    return artist.name;
}

var getSpotify = function(songName) {
    
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: songName }, function(err, data){
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songs = data.tracks.items
        for(var i=0; i<songs.length; i++){

                    var songInfo = 
            `${i}
            Artist(s): ${songs[i].artists.map(getArtistNames)}
            Song Name: ${songs[i].name}
            Preview Song: ${songs[i].preview_url}
            Album: ${songs[i].album.name}
            ==================================================
            ==================================================`
            logtxt("SONG SEARCHED: " + songName + songInfo)
            // console.log(songInfo);
            
        }
    })
}


// movie omdb
var getMovie = function(movieName) {

    if (!movieName){
        movieName = "Mr.Nobody"
    }

    axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=${key}").then(function(response){
    var movieInfo =
   `    
         ===================================================
    Title: ${response.data.Title}
    
    Year: ${response.data.Year}
    
    Rated: ${response.data.Rated}
    
    IMDB Rating: ${response.data.imdbRating}
   
    Rotten Tomatoes Rating: ${response.data.Ratings[0].Value}
    
    Country: ${response.data.Country}
   
    Language: ${response.data.Language}
   
    Plot: ${response.data.Plot}
   
    Actors: ${response.data.Actors}
    ===================================================`
    logtxt("MOVIE SEARCHED: " + movieName + movieInfo)
        // console.log(movieInfo);
    })
};


var logtxt = function(data) {
    console.log(data)

    fs.appendFile("log.txt", "\r\n" + data, function (err){
        if(err){
            return console.log(err)
        } 
    });
}

var doWhatItSays = function(){

    fs.readFile("random.txt", "utf8", function (err, data) {
        if(err){
            return console.log(err)
        }
        
        var dataArr = data.split(",")

        dataDisplay(dataArr[0], dataArr[1])
    });
}


var dataDisplay = function(func, parm) {
    switch (func) {
        case "concert-this":
            getBand(parm)
            break
        case "spotify-this-song":
            getSpotify(parm)
            break
        case "movie-this":
            getMovie(parm)
            break
        case "do-what-it-says":
            doWhatItSays()
            break
        default:
            displayDefault("Command not recognized, please try again.") 
    }
}

dataDisplay(process.argv[2], process.argv[3]);