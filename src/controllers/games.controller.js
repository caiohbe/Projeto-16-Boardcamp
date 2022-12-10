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