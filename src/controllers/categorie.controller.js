import connectionDB from "../database/db.js"

export async function getCategories(req, res) {
    try {
        const categories = await connectionDB.query('SELECT * FROM categories;')
        res.send(categories.rows)

    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function postCategories(req, res) {
    try {
        const result = await connectionDB.query(
            "INSERT INTO categories (name) VALUES ($1)",
            [req.body.name]
        )

        console.log(result)

        res.send(201)
    } catch(err) {
        res.status(500).send(err.message)
    }
    
}