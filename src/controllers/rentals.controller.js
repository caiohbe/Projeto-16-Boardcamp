import connectionDB from "../database/db.js"
import dayjs from "dayjs"

export async function postRentals(req, res) {
    
    const { customerId, gameId, daysRented } = req.body
    const date = new Date()
    const rentDate = dayjs(date).format("YYYY-MM-DD")
    try {
        const game = await connectionDB.query("SELECT * FROM games WHERE id = $1;", [gameId])
        const originalPrice = game.rows[0].pricePerDay * daysRented

        await connectionDB.query('INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);',
        [customerId, gameId, daysRented, rentDate, originalPrice, null, null])
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}