import { getCategories, postCategories } from "../controllers/categories.controller.js";
import { Router } from "express";
import validateCategory from "../middlewares/validateCategorie.middleware.js";

const router = Router()

router.get("/categories", getCategories)
router.post("/categories", validateCategory, postCategories)

export default router