import connectionDB from "../database/db.js"

export async function getCategories(req, res) {
    try {
        const categories = await connectionDB.query('SELECT * FROM categories;')
        res.send(categories.rows)

    } catch(err) {
        res.status(500).send(err.message)
    }
}