const express = require('express');
const fs = require('fs').promises;
const productsRouter = express.Router();

const products = []

productsRouter.get("/api/products", async (req, res) => {
    try {
        const data = await fs.readFile("products.json", "utf-8");
        res.send(data)
    } catch (error) {
        res.send({ message: error })
    }
})

/* http://localhost:8080/api/products */

productsRouter.get("/api/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const data = await fs.readFile("products.json", "utf-8");
        const product = await JSON.parse(data).find(ele => ele.id === parseInt(pid));
        res.send(product)
    } catch (error) {
        res.send({ message: error })
    }
})

/* http://localhost:8080/api/products/x */

productsRouter.post("/api/products", async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;

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

        for(let i of newObj){
            products.push(i)
        }

        await fs.writeFile("products.json", JSON.stringify(products));

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

productsRouter.put("/api/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const { title, description, code, price, statusProduct, stock, category } = req.body;

        const data = await fs.readFile("products.json", "utf-8");

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

        const isExist = JSON.parse(data).find(ele => ele.id === parseInt(pid));

        if (!isExist) {
            res.send("El id solicitado no existe en la base de datos")
            return
        }

        const newArr = JSON.parse(data).map(ele =>
            ele.id === parseInt(pid) ?
                { id: ele.id, ...UpdObj } : ele);

        await fs.writeFile("products.json", JSON.stringify(newArr));

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
    "price": 999,
    "statusProduct": true,
    "stock": 100,
    "category": "Product Category"
}
*/

productsRouter.delete("/api/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;

        const data = await fs.readFile("products.json", "utf-8");

        const index = JSON.parse(data).findIndex(ele =>
            ele.id === parseInt(pid));

        if (index < 0) {
            res.send({ message: "ID del producto no existe" })
            return
        }

        products.splice(index, 1);

        await fs.writeFile('products.json', JSON.stringify(products))

        res.send({ message: "producto eliminado" })
    } catch (error) {
        res.send({ message: error })
    }
})

/* http://localhost:8080/api/products/x */

module.exports = productsRouter;