import joi from "joi"
import connectionDB from "../database/db.js"

const newCustomerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().regex(/^\d+$/).min(10).max(11).required(),
    cpf: joi.string().regex(/^\d+$/).min(11).max(11).required(),
    birthday: joi.string().isoDate().required()
})

export async function validateCustomer (req, res, next) {
    const validation = newCustomerSchema.validate(req.body)

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        res.status(400).send(errors)
        return
    }

    try {
        const customers = await connectionDB.query("SELECT * FROM customers;")
        const customersCPFs = customers.rows.map(c => c.cpf)
        
        if (customersCPFs.includes(req.body.cpf)) {
            res.sendStatus(409)
            return
        }
    } catch (err) {
        res.status(500).send(err.message)
        return
    }

    next()
}