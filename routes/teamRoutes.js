import express from "express";
import {
  saveTeams,
  getTeams,
  deleteTeam,
  getTeamById,
  deleteTeamsByDate,
} from "../controllers/teamController.js";

const router = express.Router();

router.post("/", saveTeams);
router.get("/", getTeams);
router.get("/:id", getTeamById);
router.delete("/by-date", deleteTeamsByDate);
router.delete("/:id", deleteTeam);

export default router;
