import connectionDB from "../database/db.js"

export async function getCustomers(req, res) {
    let customers 

    try {
        customers = await connectionDB.query("SELECT * FROM customers;")
    } catch (err) {
        res.status(500).send(err.message)
        return
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

export async function getCustomersById(req, res) {
    const id = req.params.id
    try {
        const customers = await connectionDB.query("SELECT * FROM customers;") 
        const customer = customers.rows.filter(c => c.id === id);

        if (customer[0]) {
            res.send(customer)
            return
        } else {
            res.sendStatus(404)
            return
        }
        
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body
    try {
        connectionDB.quert("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)"
        [name, phone, cpf, birthday])
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}