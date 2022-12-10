import joi from "joi"
import connectionDB from "../database/db.js"

const newCategorieSchema = joi.object({
    name: joi.string().required()
})

export default async function validateCategorie (req, res, next) {
    const validation = newCategorieSchema.validate((req.body, { abortEarly: false }))

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        res.status(422).send(errors)
        return
    }

    try {
        const categories = await connectionDB.query("SELECT * FROM categories;")
        res.send(categories.rows)
        return
    } catch(err) {
        res.status(500).send(err.message)
    }

    next()
}