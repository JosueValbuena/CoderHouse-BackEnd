import productsModel from "../../models/products/products.models.js";

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
            throw new Error(' Error al buscar productos' + error)
        }
    };

    getProductByID = async (id) => {
        try {
            const result = await productsModel.findById({ _id: id });
            if (!result) return { code: 400, status: 'Error', message: 'Error al buscar producto' };
            return result;
        } catch (error) {
            throw new Error(' Error al buscar productos' + error)
        }
    };

    createProduct = async (title, description, code, price, stock, category, user) => {
        try {
            const result = await productsModel.create({ title, description, code, price, stock, category, user });
            if (!result) return { status: 'Error', message: 'No se pudo agregar producto ' };
            return result;
        } catch (error) {
            throw new Error(' Error al agregar producto')
        }
    };

    deleteProduct = async (pid, uid) => {
        try {
            const product = await productsModel.findById({ _id: pid });
            if (!product) return ({ code: 404, status: 'Error', message: 'No existe producto con este ID en la base de datos' });
            if (product.user.toString() !== uid) return ({ code: 400, status: 'Error', message: 'El ID del usuario no coincide con el ID del usuario registrado en el documento a eliminar' });
            const result = await productsModel.findByIdAndDelete({ _id: pid });
            console.log(result);
        } catch (error) {
            this.logger.error(error);
            throw new Error(' Error al eliminar producto' + error.message);
        }
    };
};