import Player from "../models/player.js";

// Get all players
export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find({});
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new player
export const addPlayer = async (req, res) => {
  try {
    const player = new Player(req.body);
    const savedPlayer = await player.save();
    res.status(201).json(savedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a player
export const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a player
export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle captain status
export const toggleCaptain = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    player.isCaptain = !player.isCaptain;
    await player.save();
    res.json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Set team name for a player
export const setTeamName = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { teamName: req.body.teamName },
      { new: true }
    );
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
