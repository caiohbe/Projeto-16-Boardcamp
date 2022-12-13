import { Router } from "express";
import { getRentals, postRentals } from "../controllers/rentals.controller.js";
import { validateRental } from "../middlewares/validateRental.middleware.js";

const router = Router()

router.post("/rentals", validateRental, postRentals)
router.get("/rentals", getRentals)

export default router