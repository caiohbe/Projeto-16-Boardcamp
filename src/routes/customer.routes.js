import { Router } from "express";
import { getCustomers, getCustomersById, postCustomer } from "../controllers/customer.controller.js";
import { validateCustomer } from "../middlewares/validateCustomer.middleware.js";

const router = Router()

router.get("/customers", getCustomers)
router.get("/customers/:id", getCustomersById)
router.post("/customers", validateCustomer, postCustomer)

export default router