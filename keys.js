console.log('Loading, please wait');

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
    apikey: process.env.OMDB_API_KEY
}