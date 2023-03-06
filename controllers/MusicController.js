const Music = require("../models/Music");

const getMusicList = async (req, res) => {
  try {
    const musicList = await Music.find();
    res.json(musicList);
  } catch (error) {
    res.json({ error });
  }
};

const addMusic = async (req, res) => {
  try {
    const music = new Music({
      title: req.body.title,
      artist: req.body.artist,
      album: req.body.album,
      genre: req.body.genre,
    });

    await music.save();
    res.json(music);
  } catch (error) {
    res.json({ error });
  }
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
    res.json({ error });
  }
};

const updateMusic = async (req, res) => {
  try {
    Music.findByIdAndUpdate(req.params.id, req.body)
      .then((updatedSong) => {
        res.send(updatedSong);
      })
      .catch((err) => {
        res.json("Error updating song");
      });
  } catch (error) {
    res.json({ error });
  }
};

const getStat = async (req, res) => {
  try {
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
  } catch (error) {
    res.json(error);
  }
};

const getGenre = async (req, res) => {
  try {
    const genres = await Music.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $project: { _id: 0, genre: "$_id", songs: "$count" } },
    ]);

    res.json(genres);
  } catch (error) {
    res.json({ error });
  }
};

const getArtists = async (req, res) => {
  try {
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
  } catch (error) {
    res.json({ error });
  }
};

const getAlbums = async (req, res) => {
  try {
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
  } catch (error) {
    res.json({ error });
  }
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
