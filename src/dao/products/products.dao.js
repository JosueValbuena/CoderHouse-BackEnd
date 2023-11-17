import productsModel from "../../models/products/products.models.js";

export default class Product {

    getAllProducts = async (filtro, options) => {
        try {
            const result = await productsModel.paginate(filtro, options);
            if(!result) return {status: 'Error', message: 'Error al buscar productos'};
            return result;
        } catch (error) {
            throw new Error(' Error al buscar productos' + error)
        }
    };

    getProductByID = async (id) => {
        try {
            const result = await productsModel.findById(id);
            if(!result) return {status: 'Error', message: 'Error al buscar producto'};
            return result;
        } catch (error) {
            throw new Error(' Error al buscar productos' + error)
        }
    };

    createProduct = async (title, description, code, price, stock, category) => {
        try {
            const result = await productsModel.create({ title, description, code, price, stock, category });
            if (!result) return { status: 'Error', message: 'No se pudo agregar producto ' };
            return result;
        } catch (error) {
            throw new Error(' Error al agregar producto')
        }
    };
};