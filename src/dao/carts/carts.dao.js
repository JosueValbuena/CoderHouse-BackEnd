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
        return result;
    };

    deleteUserCart = async (uid) => {
        const result = await cartsModels.deleteOne({ user: uid });
        return result;
    };
};