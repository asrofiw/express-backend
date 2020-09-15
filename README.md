<h1 align="center">ExpressJS - Application CRUD (Create, Read, Update, Delete)</h1>



This is a simple application CRUD. Built with NodeJs using the ExpressJs Framework.
Express.js is a web application framework for Node.js. [More about Express](https://en.wikipedia.org/wiki/Express.js)

## Built With
[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.18.3-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements
1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app ?
1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
4. Create a database with the name ecommerce, and create table items
5. Open Postman desktop application or Chrome web app extension that has installed before
6. Choose HTTP Method and enter request url.(ex. localhost:8080/)
7. You can see all the end point [here](#end-point)

## End Point
**1. GET**

* `/items`(Get all data from items)

* `/items/:id` (Get all data from specific id)

* `/category` (Get all data from category)

* `/category/:id` (Get all data from specific id)

* `/sub-category` (Get all data from sub-category)

* `/sub-category/:id` (Get all data from specific id)

* `/cart` (Get all data from cart)

**2. POST**

* `/items` (Create data item and post to database)

* `/category` (Create data category and post to database)

* `/sub-category` (Create data sub-category and post to database)

* `/cart` (Create data cart and post to database)

**3. PUT**

* `/items/:id` (Update all data by spesific id)

* `/category/:id` (Update all data category by spesific id)

* `/sub-category/:id` (Update all data sub-category by spesific id)

**4. PATCH**

* `/items/:id` (Update some data item by spesific id)

* `/cart/:id` (Update some data cart by spesific id)

**5. DELETE**

* `/items/:id` (Delete items by id)

* `/category/:id` (Delete category by id)

* `/sub-category/:id` (Delete sub-category by id)

* `/cart/:id` (Delete cart by id)

  