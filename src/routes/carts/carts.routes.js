import { Router } from "express";
import cartsModels from "../../models/carts/carts.models.js";
import productsModel from "../../models/products/products.models.js";
import { getAllCarts, getUserCart } from "../../controllers/carts/carts.controllers.js";

const cartsRoutes = Router();

//651cc4cff298139950c36fbf user ObjId Example

cartsRoutes.get('/allcarts', getAllCarts);
cartsRoutes.get('/usercart/:uid', getUserCart);

cartsRoutes.post('addtocart/user/:uid/product/:pid', async (req, res) => {
    try {
        const { pid, uid } = req.params;

        let cart = await cartsModels.findOne({ user: uid });

        if (!cart) {
            cart = new cartsModels({
                products: [],
                user: uid
            });
        };

        const product = await cartsModels.findOne({ 'products.product': pid });

        if (product) {

            await cartsModels.updateOne({ 'products.product': pid },
                { $inc: { 'products.$.qty': 1 } })

            res.send({
                result: 'success',
                message: 'Cantidad de producto agregada'
            })
            return
        }

        const newProduct = await productsModel.findById(pid);

        if (!newProduct) {
            res.send({
                result: 'error',
                message: 'El producto no existe'
            })
        }

        cart.products.push({
            product: newProduct._id,
            qty: 1
        });

        const result = await cart.save()

        res.status(201).json({
            result: 'success',
            payload: result
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Error al agregar producto'
        })
    }
})

cartsRoutes.put('/:cid', async (req, res) => {
    try {

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Error al agregar producto'
        })
    }
})

cartsRoutes.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { qty } = req.body;

        const cart = await cartsModels.findOne({ _id: cid });

        if (!cart) {
            res.send('ID no existe');
            return
        }

        const index = cart.products.findIndex(ele => ele.product == pid);

        cart.products[index].qty = qty;

        const result = await cartsModels.updateOne({ _id: cid }, cart);

        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Error modificar producto'
        })
    }
})

cartsRoutes.delete('/delete/user/:uid/cart/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await cartsModels.deleteOne({ _id: cid });
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Error al eliminar cart'
        })
    }
})

cartsRoutes.delete('/delete/user/:uid/cart/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await cartsModels.findOne({ _id: cid });
        const index = cart.products.findIndex(ele => ele.product == pid);
        cart.products.splice(index, 1);
        const result = await cartsModels.updateOne({ _id: cid }, cart)
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Error al eliminar producto'
        })
    }
})

export default cartsRoutes;