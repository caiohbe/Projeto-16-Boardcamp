import joi from "joi"
import connectionDB from "../database/db.js"

const newGameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().min(1).required(),
    categoryId: joi.number().required(),
    pricePerDay: joi.number().min(1).required(),
})

export async function validateGame(req, res, next) {
    const validation = newGameSchema.validate(req.body)

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        res.status(400).send(errors)
        return
    }

    try {
        const games = await connectionDB.query("SELECT * FROM games;")
        const categories = await connectionDB.query("SELECT * FROM categories;")
        const categoriesIds = categories.rows.map(c => c.id)

        if (!categoriesIds.includes(req.body.categoryId)) {
            res.sendStatus(400)
            return
        }

        if (games.rows.find(g => g.name === req.body.name)) {
            res.sendStatus(409)
            return
        }

    } catch (err) {
        res.status(500).send(err.message)
        return
    }
    
    next()
}