import { getCategories, postCategories } from "../controllers/categorie.controller.js";
import { Router } from "express";
import validateCategorie from "../middlewares/validateCategorie.middleware.js";


const router = Router()

router.get("/categories", getCategories)
router.post("/categories", validateCategorie, postCategories)

export default router