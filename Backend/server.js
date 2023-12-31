const express = require('express')
const mysql = require('mysql')
const cors=require('cors')

const app=express()
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});


app.get('/',(req,res) => {
    const query = 'SELECT * FROM todo_data';

    db.query(query, (err, result) => {
        if (err) return res.json("Error");

        return res.json(result);
    });
})

app.post('/addTask', (req, res) => {
    const query = 'INSERT INTO todo_data (name, start_date, deadline, status) VALUES (?, ?, ?, ?)';
    const values = [
        req.body.newTaskName,
        req.body.newTaskStartDate,
        req.body.newTaskDeadline,
        req.body.newTaskStatus
    ];

    db.query(query, values, (err, data) => {
        if (err) return res.json("Error")
        return res.json(data);
    });
});

app.put('/update', (req, res) => {
    const sql = 'UPDATE todo_data SET `name` = ?, `start_date` = ?, `deadline` = ?, `status` = ? WHERE ID = ?';
    const values = [
        req.body.editTaskName,
        req.body.editTaskStartDate,
        req.body.editTaskDeadline,
        req.body.editTaskStatus,
        req.body.editTaskIndex
    ];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json({ error: "Error updating task", details: err.message });
        }
        return res.json(data);
    });
});


app.listen(8585, () => {
    console.log("Server running on 8585")
})