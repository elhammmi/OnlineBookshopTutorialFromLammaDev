import express from "express";
import mysql from "mysql";
import cors from "cors"
const app = express()

const pool = async function () {
    let pool = await mysql.createPool({
        connectionLimit: 100,
        waitForConnections: true,
        queueLimit: 0,
        host: 'localhost',
        user: 'root',
        password: 'Aa@1234567',
        database: 'test',
        debug: true,
        wait_timeout: 28800,
        connect_timeout: 10
    });
    return pool;
};

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.json("hello this a backend")
})

app.get("/books", async (req, res) => {
    let db = (await pool());
    const q = "SELECT * FROM books"
    db.getConnection((err, connection) => {
        connection.query(q, (err, data) => {
            if (err) return res.json(err)
            return res.json(data)
        });
    })
});

app.post("/books", async (req, res) => {
    let db = (await pool());
    const q = "INSERT INTO books (`title`,`desc`,`price`,`cover`) VALUES (?)";
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
    ];
    db.getConnection((err, connection) => {
        connection.query(q, [values], (err, data) => {
            if (err) return res.json(err)
            return res.json(data)
        });
    })
});

app.delete("/books/:id", async (req, res) => {
    let db = (await pool());
    const bookId = req.params.id;
    const q = "DELETE FROM books WHERE id = ?";
    db.getConnection((err, connection) => {
        connection.query(q, [bookId], (err, data) => {
            if (err) return res.json(err)
            return res.json("Book has been delete successfuly")
        });
    })
});

app.put("/books/:id", async (req, res) => {
    let db = (await pool());
    const bookId = req.params.id;
    const q = "UPDATE books SET `title`=?, `desc`=?, `price`=?, `cover`=? WHERE id = ?";
    const values = [
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover,
    ];
    db.getConnection((err, connection) => {
        connection.query(q, [...values,bookId], (err, data) => {
            if (err) return res.json(err)
            return res.json("Book has been updated successfuly")
        });
    })
});
app.listen(8800, () => {
    console.log("Connected to backend!")
});