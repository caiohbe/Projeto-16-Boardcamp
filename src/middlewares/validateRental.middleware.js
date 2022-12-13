import joi from "joi"
import connectionDB from "../database/db.js"

const newRentalSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().required()
})

export async function validateRental (req, res, next) {
    const validation = newRentalSchema.validate(req.body)

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        res.status(400).send(errors)
        return
    }

    const { customerId, gameId, daysRented } = req.body

    try {
        const customers = await connectionDB.query("SELECT * FROM customers WHERE id=$1;", [customerId])
        const games = await connectionDB.query("SELECT * FROM games WHERE id=$1;", [gameId])
        const game = games.rows[0]

        if (!customers.rows[0] || !game || daysRented <= 0 || game.stockTotal <= 0) {
            res.sendStatus(400)
            return
        }

    } catch (err) {
        res.status(500).send(err.message)
    }

    next()
}

export async function validateReturn (req, res, next) {
    try {
        const rentals = await connectionDB.query("SELECT * FROM rentals;")
        const returningRental = rentals.rows.find(e => e.id == req.params.id)

        if (!returningRental) {
            res.sendStatus(404)
            return 
        }

        if (returningRental.returnDate) {
            res.sendStatus(400)
            return
        }
    } catch (err) {
        res.status(500).send(err.message)
    }

    next()
}

export async function validateDelete (req, res, next) {
    try {
        const rentals = await connectionDB.query("SELECT * FROM rentals;")
        const deletingRental = rentals.rows.find(e => e.id == req.params.id)

        if (!deletingRental) {
            res.sendStatus(404)
            return 
        }

        if (!deletingRental.returnDate) {
            res.sendStatus(400)
            return
        }
    } catch (err) {
        res.status(500).send(err.message)
    }

    next()
}