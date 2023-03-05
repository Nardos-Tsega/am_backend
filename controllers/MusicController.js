const Music = require("../models/Music");

const getMusicList = async (req, res) => {
  const musicList = await Music.find();
  res.send(musicList);
};

const addMusic = async (req, res) => {
  const music = new Music({
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
    genre: req.body.genre,
  });

  await music.save();
  res.json(music);
};

const deleteMusic = async (req, res) => {
  const { id } = req.params;

  try {
    const song = await Music.findByIdAndDelete(id);

    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateMusic = async (req, res) => {
  Music.findByIdAndUpdate(req.params.id, req.body)
    .then((updatedSong) => {
      res.send(updatedSong);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error updating song");
    });
};

const getStat = async (req, res) => {
  const songsCount = await Music.countDocuments();
  const artistsCount = (await Music.distinct("artist")).length;
  const albumsCount = (await Music.distinct("album")).length;
  const genresCount = (await Music.distinct("genre")).length;

  res.json({
    songs: songsCount,
    artists: artistsCount,
    albums: albumsCount,
    genres: genresCount,
  });
};

const getGenre = async (req, res) => {
  const genres = await Music.aggregate([
    { $group: { _id: "$genre", count: { $sum: 1 } } },
    { $project: { _id: 0, genre: "$_id", songs: "$count" } },
  ]);

  res.json(genres);
};

const getArtists = async (req, res) => {
  const artists = await Music.aggregate([
    {
      $group: {
        _id: "$artist",
        songs: { $sum: 1 },
        albums: { $addToSet: "$album" },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        songs: "$songs",
        albums: { $size: "$albums" },
      },
    },
  ]);

  res.json(artists);
};

const getAlbums = async (req, res) => {
  const albums = await Music.aggregate([
    {
      $group: {
        _id: { album: "$album", artist: "$artist" },
        songs: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        album: "$_id.album",
        artist: "$_id.artist",
        songs: "$songs",
      },
    },
  ]);

  res.json(albums);
};

module.exports = {
  getMusicList,
  addMusic,
  getStat,
  getGenre,
  getArtists,
  getAlbums,
  deleteMusic,
  updateMusic,
};
