import cartsModels from "../../models/carts/carts.models.js";

export default class Cart {
    constructor(logger) {
        this.logger = logger;
    };

    getAllCarts = async () => {
        const result = await cartsModels.find();
        return result;
    };

    getUserCart = async (uid) => {
        const result = await cartsModels.find({ user: uid });
        if (result.length < 1) return { status: 'Error', message: 'No se encontro ningun carrito con este ID de usuario' };
        return result;
    };

    

    deleteUserCart = async (uid) => {
        const result = await cartsModels.deleteOne({user: uid});
        return result;
    };
};