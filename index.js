const express = require('express')
const bodyParser = require('body-parser')
const db = require('./src/helper/db')
const qs = require('querystring')
const { query } = require('express')

const app = express()

// middleware
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/items', (req,res) => {
    const {name, price, description} = req.body
    if (name && price && description) {
        // db.connect()
        db.query(`INSERT INTO items (name, price, description) VALUE ('${name}', ${price}, '${description}')`, (err, result, field) => {
            if (!err){
                res.status(201).send({
                    succes: true,
                    message: 'Item has been created',
                    data: req.body
                })
            } else {
                res.status(500).send({
                    succes: false,
                    message: 'Internal server error'
                })
            }
            
        })
        // db.end()
    } else {
        res.status(400).send({
            succes: false,
            message: 'All field must be filled'
        })
    }
})

app.get('/items', (req,res) => {
    let {page, limit, search} = req.query
    let searchKey = ''
    let searchValue = ''
    if(typeof search === 'object'){
        searchKey = Object.keys(search)[0]
        searchValue = Object.values(search)[0]
    } else {
        searchKey = 'name'
        searchValue = search || ''
    }
    
    if(!limit){
        limit = 5
    } else {
        limit = parseInt(limit)
    }

    if(!page){
        page = 1
    } else {
        page = parseInt(page)
    }
    const offset = (page-1) * limit
    const query = `SELECT * FROM items WHERE ${searchKey} LIKE '%${searchValue}%' LIMIT ${limit} OFFSET ${offset}`
    console.log(query)

    db.query(query, (err, result, field) => {
        if(!err){
            const pageInfo = {
                count: 0,
                pages: 0,
                currentPage: page,
                limitPerPage: limit,
                nextLink: null,
                prevLink: null,
            }
            if(result.length){
                db.query(`SELECT COUNT(*) AS count FROM items WHERE ${searchKey} LIKE '%${searchValue}%'`, (err, data, field) => {
                    const {count} = data[0]
                    pageInfo.count = count
                    pageInfo.pages = Math.ceil(count/limit)

                    const {pages, currentPage} = pageInfo

                    if(currentPage < pages){
                        pageInfo.nextLink = `http://localhost:8080/items?${qs.stringify({...req.query, ...{page: page+1}})}`
                    }

                    if(currentPage > 1){
                        pageInfo.prevLink = `http://localhost:8080/items?${qs.stringify({...req.query, ...{page: page-1}})}`
                    }
                    res.send({
                        succes: true,
                        message: 'List of items',
                        data: result,
                        pageInfo
                    })
                })
            } else {
                res.send({
                    succes: true,
                    message: 'There is no items on list',
                    pageInfo
                })
            }
        } else {
            res.status(500).send({
                succes: false,
                message: 'Internal server error'
            })
        }
    })
})

app.put('/items/:id', (req,res) => {
    const {name, price, description} = req.body
    let sqlQuery = `UPDATE items SET name = '${name}', price = ${price}, description = '${description}' WHERE id = ${req.params.id}`
    
    db.query(sqlQuery, (err, result,field) => {
        if(!err){
            res.status(201).send({
                succes: true,
                message: 'Data has been updated',
                data: req.body
            })
        } else {
            res.status().send({
                succes: false,
                message: 'Internal server error'
            })
        }
    })
})

app.patch('/items/:id', (req,res) => {
    const key = Object.keys(req.body)
    const value = Object.values(req.body)
    let sqlQuery = `UPDATE items SET ${key} = '${value}' WHERE id = ${req.params.id}`

    db.query(sqlQuery, (err, result, field) => {
        if(!err){
            res.status(201).send({
                succes: true,
                message: 'Data has been updated',
                data: req.body
            })
        } else {
            res.status().send({
                succes: false,
                message: 'Internal server error'
            })
        }
    })
})

app.delete('/items/:id', (req,res) => {
    let sqlQuery = `DELETE FROM items WHERE id = ${req.params.id}`

    db.query(sqlQuery, (err, result, field) => {
        if(!err){
            res.status(201).send({
                succes: true,
                message: 'Data has been deleted',
                data: null
            })
        } else {
            res.status(500).send({
                succes: false,
                message: 'Internal server error'
            })
        }
    })
})

app.get('/items/:id', (req,res) => {
    let sqlQuery = `SELECT * FROM items WHERE id = ${req.params.id}`
    
    db.query(sqlQuery, (err, result,field) => {
        if(!err){
            console.log(result)
            res.status(201).send({
                succes: true,
                message: `Showing data from id : ${req.params.id}`,
                data: result
            })
        } else {
            res.status().send({
                succes: false,
                message: 'Internal server error'
            })
        }
    })
})

app.listen(8080, () => {
    console.log('Listening to the Port 8080')
})