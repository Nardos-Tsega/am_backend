const express = require("express");
const router = express.Router();

const {
  getMusicList,
  addMusic,
  getStat,
  getGenre,
  getArtists,
  getAlbums,
  deleteMusic,
  updateMusic,
} = require("../controllers/MusicController");

router.post("/songs", addMusic);
router.delete("/songs/:id", deleteMusic);
router.put("/songs/:id", updateMusic);
router.get("/songs", getMusicList);
router.get("/stats", getStat);
router.get("/genres", getGenre);
router.get("/artists", getArtists);
router.get("/albums", getAlbums);

module.exports = router;
