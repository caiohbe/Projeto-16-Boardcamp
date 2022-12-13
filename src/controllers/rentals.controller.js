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

export async function getRentals (req, res){
    const {customerId, gameId} = req.query
    console.log(customerId, gameId)

    const rentalQuery = `
        SELECT 
            rentals.*,
        ROW_TO_JSON
            (customers.*) AS customer, 
        JSON_BUILD_OBJECT(
            'id',games.id,
            'name',games.name,
            'categoryId',games."categoryId",
            'categoryName',categories.name
            ) AS game 
        FROM 
            rentals
        JOIN 
            customers
        ON 
            customers.id ="customerId"
        JOIN 
            games 
        ON 
            games.id = "gameId" 
        JOIN 
            categories 
        ON 
            categories.id = games."categoryId";
    `

    try{
        const rentals =  (await (connectionDB.query(rentalQuery))).rows

        if(customerId && gameId){
            const result = rentals.filter((r) => {
                if (r.customerId == customerId && r.gameId == gameId) {
                    return true
                }
            })

            res.send(result)
            return
        } else if (customerId && !gameId){
            const result = rentals.filter((r) => {
                if (r.customerId == customerId) {
                    return true
                }
            })

            res.send(result)
            return 
        } else if (!customerId && gameId){
            const result = rentals.filter((r) => {
                if (r.gameId == gameId) {
                    return true
                }
            })

            res.send(result)
            return
        } else {
            res.send(rentals)  
        }

    } catch (err){
        res.status(500).send(err.message)
    }
};