import Team from "../models/team.js";

// Save generated teams
export const saveTeams = async (req, res) => {
  try {
    const teams = req.body;
    const savedTeams = [];

    for (const team of teams) {
      const newTeam = new Team({
        name: team.captain.teamName || team.captain.name,
        captain: team.captain._id,
        players: team.players.map((player) => player._id),
      });
      const savedTeam = await newTeam.save();
      // Populate captain and players
      const populatedTeam = await Team.findById(savedTeam._id)
        .populate("captain")
        .populate("players");
      savedTeams.push(populatedTeam);
    }

    res.status(201).json(savedTeams);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get teams by date
export const getTeams = async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const teams = await Team.find(query)
      .populate("captain")
      .populate("players")
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get team details by ID
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("captain")
      .populate("players");

    if (!team) {
      return res.status(404).json({ message: "টিম পাওয়া যায়নি" });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a team
export const deleteTeam = async (req, res) => {
  try {
    console.log("Deleting team with ID:", req.params.id);
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      console.log("Team not found");
      return res.status(404).json({ message: "টিম পাওয়া যায়নি" });
    }
    console.log("Team deleted successfully:", team);
    res.json({ message: "টিম সফলভাবে মুছে ফেলা হয়েছে" });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete teams by date
export const deleteTeamsByDate = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "তারিখ প্রদান করা হয়নি" });
    }

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const result = await Team.deleteMany({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    console.log("Deleted teams count:", result.deletedCount);

    res.json({
      message: `${result.deletedCount}টি টিম সফলভাবে মুছে ফেলা হয়েছে`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting teams by date:", error);
    res.status(500).json({ message: error.message });
  }
};
