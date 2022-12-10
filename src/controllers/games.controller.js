import connectionDB from "../database/db.js"

export async function getGames(req, res) {
    let games

    try {
        games = await connectionDB.query("SELECT * FROM games;")
    } catch (err) {
        res.status(500).send(err.message)
    }

    
    if (req.query.name) {
        const name = req.query.name.toLowerCase()
    
        const result = games.rows.filter((g) => {
            if (g.name.toLowerCase().includes(name)) {
                return true
            }
        })

        res.send(result)
        return
    }
    
    res.send(games.rows)
}

export async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body

    try {
        connectionDB.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);',
        [name, image, stockTotal, categoryId, pricePerDay])
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}