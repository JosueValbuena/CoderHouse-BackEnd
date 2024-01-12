export default class CartsRepository {
    constructor(dao) {
        this.dao = dao
    };

    getAllCarts = async () => {
        const result = await this.dao.getAllCarts();
        return result
    };

    getUserCart = async (uid) => {
        const result = await this.dao.getUserCart(uid);
        return result;
    };

    
};