import { Router } from "express";
import { deleteRental, getRentals, postRentals, postRentalsById } from "../controllers/rentals.controller.js";
import { validateDelete, validateRental, validateReturn } from "../middlewares/validateRental.middleware.js";

const router = Router()

router.post("/rentals", validateRental, postRentals)
router.get("/rentals", getRentals)
router.post("/rentals/:id/return", validateReturn, postRentalsById)
router.delete("/rentals/:id", validateDelete, deleteRental)

export default router