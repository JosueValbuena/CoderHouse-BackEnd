import { Router } from "express";
import cartsModels from "../../models/carts/carts.models.js";
import productsModel from "../../models/products/products.models.js";

const cartsRoutes = Router();

//651cc4cff298139950c36fbf ObjId Example

cartsRoutes.get('/', async (req, res) => {
    try {
        const result = await cartsModels.find();
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Error en la busqueda'
        })
    }
})

cartsRoutes.post('/', async (req, res) => {
    try {
        const { pid, uid } = req.body;

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


export default cartsRoutes;