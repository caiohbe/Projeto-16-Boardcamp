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
}

export async function postRentalsById(req, res) {
    const id = req.params.id

    try {
        const today = dayjs(new Date()).format("YYYY/MM/DD")
        const rent = await connectionDB.query("SELECT * FROM rentals WHERE id=$1;",
        [id])
        const rentDate = (dayjs(rent.rows[0].rentDate).format("YYYY/MM/DD"))
        let dayDiff = ((new Date(today).getTime()) - (new Date(rentDate).getTime()))
        const pricePerDay = ((rent.rows[0].originalPrice)/(rent.rows[0].daysRented))

        if (dayDiff !== 0) {
            dayDiff = dayjs(dayDiff).format("D")
        }
        
        const delayFee = pricePerDay * dayDiff

        await connectionDB.query('UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3',
        [today, delayFee, id])

        res.sendStatus(200)

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteRental(req, res) {
    try {
        await connectionDB.query("DELETE FROM rentals WHERE id=$1;",
        [req.params.id])

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}