const express = require('express');
const productsRouter = express.Router();

const products = [];

productsRouter.get("/api/products", (req, res) => {
    try {
        res.send(products)
    } catch (error) {
        res.send({ message: error })
    }
})

/* http://localhost:8080/api/products */

productsRouter.get("/api/products/:pid", (req, res) => {
    try {
        const { pid } = req.params;
        const product = products.find(ele => ele.id === parseInt(pid));
        res.send(product)
    } catch (error) {
        res.send({ message: error })
    }
})

/* http://localhost:8080/api/products/x */

productsRouter.post("/api/products", (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;

        console.log(req.body)

        if (!title || !description || !code || !price || !stock || !category) {
            res.send("Todos los campos son obligatorios")
            return
        }

        if (isNaN(price) || isNaN(stock)) {
            res.send("Campos 'price' y 'stock', deben ser numeros")
            return
        }

        const newObj = {
            id: Number(Date.now().toString()),
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category
        }
        products.push(newObj)
        res.send({ message: "producto agregado satisfactoriamente" })
    } catch (error) {
        res.send({ message: error })
    }
})

/* 

http://localhost:8080/api/products

{
    "title": "Product Title",
    "description": "Product Description",
    "code": "Product Code",
    "price": "1000",
    "stock": "10",
    "category": "Product Category"
}
*/

productsRouter.put("/api/products/:pid", (req, res) => {
    try {
        const { pid } = req.params;
        const { title, description, code, price, statusProduct, stock, category } = req.body;

        console.log(req.params)
        console.log(req.body)

        if (!title || !description || !code || !price || !statusProduct || !stock || !category) {
            res.send("Todos los campos son obligatorios")
            return
        }

        if (isNaN(price) || isNaN(stock)) {
            res.send("Campos 'price' y 'stock', deben ser numeros")
            return
        }

        if (typeof statusProduct != 'boolean') {
            res.send("El campo 'statusProduct' debe ser true o false")
            return
        }

        const UpdObj = {
            title,
            description,
            code,
            price,
            statusProduct,
            stock,
            category
        }

        const isExist = products.find(ele => ele.id === parseInt(pid));

        if (!isExist) {
            res.send("El id solicitado no existe en la base de datos")
            return
        }

        const newArr = products.map(ele =>
            ele.id === parseInt(pid) ?
                { ...UpdObj } : ele);

        console.log(newArr);
        res.send({ message: "producto modificado" })
    } catch (error) {
        res.send({ message: error })
    }
})

/* 

http://localhost:8080/api/products/x

{
    "title": "Product Title",
    "description": "Product Description",
    "code": "Product Code",
    "price": 1000,
    "statusProduct": false,
    "stock": 100,
    "category": "Product Category"
}
*/

productsRouter.delete("/api/products/:pid", (req, res) => {
    try {
        const { pid } = req.params;

        const index = products.findIndex(ele =>
            ele.id === parseInt(pid));

            console.log(index)
        if (index < 0) {
            res.send({ message: "ID del producto no existe" })
            return
        }

        products.splice(index, 1);

        res.send({ message: "producto eliminado" })
    } catch (error) {
        res.send({ message: error })
    }
})

/* http://localhost:8080/api/products/x */

module.exports = productsRouter;