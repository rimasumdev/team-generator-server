import express from "express";
import {
  getPlayers,
  addPlayer,
  updatePlayer,
  deletePlayer,
  toggleCaptain,
  setTeamName,
} from "../controllers/playerController.js";

const router = express.Router();

router.get("/", getPlayers);
router.post("/", addPlayer);
router.put("/:id", updatePlayer);
router.delete("/:id", deletePlayer);
router.put("/:id/toggle-captain", toggleCaptain);
router.put("/:id/team-name", setTeamName);

export default router;
