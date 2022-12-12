import { Router } from "express";
import { getCustomers, getCustomersById, postCustomer, putCustomer } from "../controllers/customer.controller.js";
import { validateCustomer } from "../middlewares/validateCustomer.middleware.js";

const router = Router()

router.get("/customers", getCustomers)
router.get("/customers/:id", getCustomersById)
router.post("/customers", validateCustomer, postCustomer)
router.put("/customers/:id", validateCustomer, putCustomer)

export default router