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

        const baseURL = 'http://localhost:3001/api/products';
        let URLparams = '?';

        if(sort){
            URLparams += '&sort='+sort
        }
        if(category){
            URLparams += '&category='+category
        }

        res.send({
            status: 'success',
            payload: result,
            prevLink: result.hasPrevPage ? baseURL+URLparams+`&limit=${result.limit}`+`&page=${result.prevPage}` : 'No tiene pagina previa',
            nextLinkPage: result.hasNextPage ? baseURL+URLparams+`&limit=${result.limit}`+`&page=${result.nextPage}` : 'No tiene pagina siguiente'
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