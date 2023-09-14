const express = require('express');
const cartRouter = express.Router();
const fs = require('fs').promises;

let cart = [];

cartRouter.get('/api/cart', async (req, res) => {
    try {
        const response = await fs.readFile('cart.txt', 'utf-8');
        const data = JSON.parse(response)
        res.json(data)
    } catch (error) {
        res.send({ message: error })
    }
})

/* 
http://localhost:3001/api/cart 
*/

cartRouter.post('/api/cart', async (req, res) => {
    try {
        const data = await fs.readFile('products.txt', 'utf-8');
        const products = JSON.parse(data);

        const newProducts = products.map(ele => {
            return { id: ele.id, quanty: 1 }
        })

        const newCart = {
            id: Date.now(),
            products: newProducts
        }

        cart.push(newCart);

        await fs.writeFile('cart.txt', JSON.stringify(cart));
        res.send('Carrito creado correctamente')
    } catch (error) {
        res.send({ message: error })
    }
})

/* 
http://localhost:3001/api/cart
 */

cartRouter.get('/api/cart/:cid', async (req, res) => {
    try {
        const data = await fs.readFile('cart.txt', 'utf-8');

        const { cid } = req.params;

        const cartJson = JSON.parse(data).find(ele => ele.id === parseInt(cid));

        res.json(cartJson)
    } catch (error) {
        res.send({ message: error })
    }
})

/* 
http://localhost:3001/api/cart/x
*/

cartRouter.post('/api/cart/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params

        const dataCart = await fs.readFile('cart.txt', 'utf-8');
        const dataProducts = await fs.readFile('products.txt', 'utf-8');

        const cartIndex = JSON.parse(dataCart).findIndex(ele => ele.id === parseInt(cid));

        if (cartIndex < 0) {
            return res.send("No hay elementos en el carrito con el ID solicitad")
        }

        const isExist = JSON.parse(dataCart)[cartIndex].products.some(ele => ele.id === parseInt(pid));

        let newObj;

        if (isExist) {
            newObj = JSON.parse(dataCart).map(ele => {
                return ele.id === parseInt(cid) ? 
                {
                    ...ele, products: products.map(ele => {
                       return ele.id === parseInt(pid) ?
                            { ...ele, quanty: quanty + 1 }
                            : ele;
                    })
                }

                    : ele
            })
        } else {
            "else";
        }

        res.send(newObj)
    } catch (error) {
        res.send({ message: error })
    }
})

module.exports = cartRouter;