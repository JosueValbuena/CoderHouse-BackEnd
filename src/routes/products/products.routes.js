import { Router } from "express";
import productsModel from "../../models/products/products.models.js";

const productsRoutes = Router();

productsRoutes.get('/', async (req, res) => {
    try {
        
        const { limit, page, sort, category } = req.query;
        const limitNumber = parseInt(limit) || 10;
        const pageNumber = parseInt(page) || 1;

        const options = {
            limit: limitNumber,
            page: pageNumber,
            sort: {}
        }

        if (sort) {
            if (sort === 'asc') {
                options.sort = { price: 1 };
            } else if (sort === 'desc') {
                options.sort = { price: -1 }
            }
        } else {
            options.sort = { _id: 1 }
        }

        const filtro = {};

        if (category) {
            filtro.category = category;
        }

        const result = await productsModel.paginate(filtro, options)

        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Error en la busqueda'
        })
    }
});

productsRoutes.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            res.send('Todos los campos son obligatorios');
            return
        }

        const product = {
            title,
            description,
            code,
            price,
            stock,
            category
        }

        const result = await productsModel.create({ title, description, code, price, stock, category });

        if (!result._id) {
            res.send({
                status: 'error',
                message: 'Error al agregar producto'
            })
        } else {
            res.send({
                status: 'success',
                payload: result
            })
        }

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Error agregando producto'
        })
    }
})

export default productsRoutes;