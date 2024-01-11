import { productsService } from "../../repository/index.repository.js";

export const getAllProducts = async (req, res) => {
    try {
        const { limit, page, sort, category } = req.query;
        const limitNumber = parseInt(limit) || 10;
        const pageNumber = parseInt(page) || 1;

        const options = {
            limit: limitNumber,
            page: pageNumber,
            sort: {}
        };

        if (sort) {
            if (sort === 'asc') {
                options.sort = { price: 1 };
            } else if (sort === 'desc') {
                options.sort = { price: -1 }
            }
        } else {
            options.sort = { _id: 1 }
        };

        const filtro = {};

        if (category) {
            filtro.category = category;
        };

        const result = await productsService.getAllProducts(filtro, options);

        const baseURL = 'http://localhost:3001/api/products';
        let URLparams = '?';

        if (sort) {
            URLparams += '&sort=' + sort
        };
        if (category) {
            URLparams += '&category=' + category
        };

        res.json({
            status: 'success',
            payload: result,
            prevLink: result.hasPrevPage ? baseURL + URLparams + `&limit=${result.limit}` + `&page=${result.prevPage}` : 'No tiene pagina previa',
            nextLinkPage: result.hasNextPage ? baseURL + URLparams + `&limit=${result.limit}` + `&page=${result.nextPage}` : 'No tiene pagina siguiente'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error en la busqueda'
        });
    };
};

export const createProduct = async (req, res) => {
    try {
        const { title, description, code, price, stock, category, user } = req.body;

        if (!title || !description || !code || !price || !stock || !category || !user) {
            return res.status(400).json({ status: 'Error', message: 'Todos los campos son obligatorios' });
        }

        const result = await productsService.createProduct(title, description, code, price, stock, category, user);

        if (result.status === 'Error') return res.status(401).json({ status: 'error', message: 'Error al agregar producto' })

        res.status(201).json({ status: 'Success', payload: result });

    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'En el servidor agregando producto',
            error: error.message
        });
    }
};

export const getProductByID = async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await productsService.getProductByID(pid);
        if (result.status === 'Error') return res.status(result.code).json({ status: result.status, message: result.message });
        res.status(200).json({ status: 'Success', payload: result });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'En el servidor al buscar producto',
            error: error.message
        })
    };
};

export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const { uid } = req.body;
        if (!pid || !uid) return res.status(400).json({ status: 'Error', message: 'ID del usuario y producto requerido' });
        const result = await productsService.deleteProduct(pid, uid);
        if (result && result.status && result.code) return res.status(result.code).json({ status: result.status, message: result.message });
        res.status(200).json({ status: 'Success', message: 'Producto eliminado con exito', payload: result });
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'En el servidor al eliminar producto',
            error: error.message
        })
    };
};