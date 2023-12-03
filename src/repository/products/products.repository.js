export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    };

    getAllProducts = async (filtro, options) => {
        let result = await this.dao.getAllProducts(filtro, options);
        return result;
    };

    createProduct = async (title, description, code, price, stock, category) => {
        let result = await this.dao.createProduct(title, description, code, price, stock, category);
        return result
    };

    getProductByID = async (pid) => {
        let result = await this.dao.getProductByID(pid);
        return result;
    };
};