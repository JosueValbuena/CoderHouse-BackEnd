import { isValidObjectId } from "mongoose";
import { productsService } from "../../repository/index.repository.js";
import nodeMailer from 'nodemailer';

export const getAllProducts = async (req, res) => {
    try {
        const { limit, page, sort, category } = req.query;
        const limitNumber = parseInt(limit) || 12;
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

        const baseURL = 'http://localhost:3001/api/products/all';
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

export const getAllProductsFromUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const validId = isValidObjectId(uid);
        if (!validId) return res.status(400).json({
            status: 'Error',
            message: 'El ID del usuario no es valido'
        });
        const result = await productsService.getAllProductsFromUser(uid);
        if (result.status === 'Error') return res.status(result.code).json({
            status: result.status,
            message: result.message
        });

        res.status(200).json({
            status: 'Success',
            message: 'consulta realizada con exito',
            payload: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error en la busqueda',
            error: error.message
        });
    };
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

export const editProductByUserOwner = async (req, res) => {
    try {
        const { pid, uid } = req.params;
        const { title,
            description,
            code,
            price,
            stock,
            category
        } = req.body;

        const validPid = isValidObjectId(pid);
        const validUid = isValidObjectId(uid);

        if (!validPid || !validUid) return res.status(400).json({
            status: 'Error',
            message: 'Los datos enviados no son validos'
        });

        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category
        };

        const result = await productsService.editProductByUserOwner(pid, uid, newProduct);
        if (result.status === 'Error') return res.status(result.code).json({
            status: result.status,
            message: result.message
        });
        res.status(201).json({
            status: 'Success',
            message: 'Producto modificado con exito',
            payload: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Error en el servidor al editar producto',
            error: error.message
        });
    };
};

export const editProductByAdmin = async (req, res) => {
    try {
        const { pid } = req.params;
        const isValidtId = isValidObjectId(pid);
        if (!isValidtId) return res.status(400).json({
            status: 'Error',
            message: 'El ID no es correcto'
        });

        const {
            title,
            description,
            code,
            price,
            stock,
            category
        } = req.body;

        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category
        };

        const result = await productsService.editProductByAdmin(pid, newProduct);

        if (result.status && result.status === 'Error') return res.status(result.code).json({
            status: result.status,
            message: result.message
        });

        res.status(201).json({
            status: 'Success',
            message: 'Producto modificado con exito',
            payload: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Error en el servidor al editar producto',
            error: error.message
        });
    };
};

export const deleteProductByUserOwner = async (req, res) => {
    try {
        const { pid, uid } = req.params;

        if (!pid || !uid) return res.status(400).json({
            status: 'Error',
            message: 'ID del usuario y producto requerido'
        });

        const result = await productsService.deleteProduct(pid, uid);

        if (result.status === 'Error') return res.status(result.code).json({
            status: result.status,
            message: result.message
        });

        if (result.userRole === 'premium') {
            const transporter = nodeMailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.MAIL,
                    pass: process.env.PASS
                }
            });

            const mailOptions = {
                from: 'joshvlbn@gmail.com',
                to: result.userEmail,
                subject: 'Aviso de producto eliminado',
                text: `Le informamos que su producto ${result.productTitle} ha sido eliminado`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    req.logger.error(error);
                    return res.status(500).send('Error al enviar correo de recuperacion');
                };
                req.logger.info('Correo informativo enviado correctamente')
                res.status(200).json({ status: 'Succes', message: 'Correo de recuperacion enviado correctamente' });
            });
        }
        req.logger.info('Producto eliminado correctamente');
        res.status(204).end();
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'En el servidor al eliminar producto',
            error: error.message
        })
    };
};