import productsModel from "../../models/products/products.models.js";
import usersModel from "../../models/user/user.model.js";

export default class Product {

    constructor(logger) {
        this.logger = logger;
    };

    getAllProducts = async (filtro, options) => {
        try {
            const result = await productsModel.paginate(filtro, options);
            if (!result) return { status: 'Error', message: 'Error al buscar productos' };
            return result;
        } catch (error) {
            throw new Error('Error al buscar productos' + error)
        }
    };

    getAllProductsFromUser = async (uid) => {
        try {
            const result = await productsModel.find({ user: uid });
            if (!result || result.length <= -1) return {
                code: 404,
                status: 'Error',
                message: 'No se encontraron productos con el ID del usuario'
            };
            return result;
        } catch (error) {
            throw new Error('Error al buscar productos por usuario', error.message);
        };
    };

    getProductByID = async (id) => {
        try {
            const result = await productsModel.findById({ _id: id });
            if (!result) return { code: 400, status: 'Error', message: 'Error al buscar producto' };
            return result;
        } catch (error) {
            throw new Error(' Error al buscar productos' + error)
        };
    };

    createProduct = async (title, description, code, price, stock, category, user) => {
        try {
            const result = await productsModel.create({ title, description, code, price, stock, category, user });
            if (!result) return { status: 'Error', message: 'No se pudo agregar producto ' };
            return result;
        } catch (error) {
            throw new Error('Error al agregar producto', error.message);
        };
    };

    editProduct = async (pid, uid, newProduct) => {
        try {
            const product = await productsModel.findById({ _id: pid });
            const result = await productsModel.updateOne({ _id: pid }, { $set: newProduct });
            if (product.user.toString() !== uid) return {
                code: 400,
                status: 'Error',
                message: 'Los datos enviados no coinciden'
            };
            if (result.matchedCount === 0 || !result.acknowledged) return {
                code: 400,
                status: 'Error',
                message: 'No se encontro producto con este ID'
            };
            if (result.modifiedCount === 0) return {
                code: 404,
                status: 'Error',
                message: 'Los datos nuevos del producto no pueden ser iguales a los actuales'
            };
            return result;
        } catch (error) {
            throw new Error('Error al editar producto', error.message);
        };
    };

    deleteProduct = async (pid, uid) => {
        try {
            const user = await usersModel.findById({ _id: uid });
            const product = await productsModel.findByIdAndDelete({ _id: pid });

            if (!user) return ({
                code: 404,
                status: 'Error',
                message: 'No existe usuario con este ID en la base de datos'
            });

            if (!product) return ({
                code: 404,
                status: 'Error',
                message: 'No existe producto con este ID en la base de datos'
            });

            if (product.user.toString() !== uid) return ({
                code: 400,
                status: 'Error',
                message: 'El ID del usuario no coincide con el ID del usuario registrado en el documento a eliminar'
            });

            const result = {
                userRole: user.role,
                userEmail: user.email,
                productTitle: product.title
            };

            console.log(result);
            return result;
        } catch (error) {
            this.logger.error(error);
            throw new Error(' Error al eliminar producto' + error.message);
        }
    };
};