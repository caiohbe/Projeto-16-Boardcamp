import connectionDB from "../database/db.js"

export async function getCustomers(req, res) {
    let customers 

    try {
        customers = connectionDB.query("SELECT * FROM customers;")
    } catch (err) {
        res.status(500).send(err.message)
    }

    if (req.query.name) {
        const cpf = req.query.cpf
    
        const result = customers.rows.filter((c) => {
            if (c.cpf.includes(cpf)) {
                return true
            }
        })

        res.send(result)
        return
    }

    res.send(customers.rows)
}