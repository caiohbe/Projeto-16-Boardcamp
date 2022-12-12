import joi from "joi"
import connectionDB from "../database/db.js"

const newCategorySchema = joi.object({
    name: joi.string().required()
})

export default async function validateCategory (req, res, next) {
    const validation = newCategorySchema.validate(req.body)

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        res.status(400).send(errors)
        return
    }

    try {
        const categories = await connectionDB.query("SELECT * FROM categories;")
        
        if (categories.rows.find(c => c.name === req.body.name)) {
            res.sendStatus(409)
            return
        }
        
    } catch(err) {
        res.status(500).send(err.message)
    }
    
    next()
}