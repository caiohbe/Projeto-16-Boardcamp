import express from "express";
import cors from "cors"
import categoriesRouters from "./routes/categories.routes.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use(categoriesRouters)

/*
app.get('/categories', async (req, res) => {
    try {
        const categories = await connectionDB.query('SELECT * FROM categories;')
        res.send(categories.rows)

    } catch(err) {
        res.status(500).send(err.message)
    }
})
*/

const port = 4000;
app.listen(port, () => console.log(`Server running in port ${port}`))