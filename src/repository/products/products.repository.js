export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    };

    getAllProducts = async (filtro, options) => {
        let result = await this.dao.getAllProducts(filtro, options);
        return result;
    };

    createProduct = async (title, description, code, price, stock, category, user) => {
        let result = await this.dao.createProduct(title, description, code, price, stock, category, user);
        return result
    };

    getProductByID = async (pid) => {
        let result = await this.dao.getProductByID(pid);
        return result;
    };

    deleteProduct = async (pid, uid) => {
        let result = await this.dao.deleteProduct(pid, uid);
        return result;
    };
};