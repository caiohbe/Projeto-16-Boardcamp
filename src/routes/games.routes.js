import { Router } from "express";
import { getGames, postGames } from "../controllers/games.controller.js";
import { validateGame } from "../middlewares/validateGame.middleware.js";

const router = Router()

router.get("/games", getGames)
router.post("/games", validateGame, postGames)

export default router