import { Router } from "express";
import { getRentals, postRentals, postRentalsById } from "../controllers/rentals.controller.js";
import { validateRental, validateReturn } from "../middlewares/validateRental.middleware.js";

const router = Router()

router.post("/rentals", validateRental, postRentals)
router.get("/rentals", getRentals)
router.post('/rentals/:id/return', validateReturn,postRentalsById)

export default router