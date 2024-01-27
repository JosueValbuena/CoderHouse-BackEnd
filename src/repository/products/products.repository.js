export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    };

    getAllProducts = async (filtro, options) => {
        let result = await this.dao.getAllProducts(filtro, options);
        return result;
    };

    getAllProductsFromUser = async (uid) => {
        const result = await this.dao.getAllProductsFromUser(uid);
        return result
    };

    createProduct = async (title, description, code, price, stock, category, user) => {
        let result = await this.dao.createProduct(title, description, code, price, stock, category, user);
        return result
    };

    getProductByID = async (pid) => {
        let result = await this.dao.getProductByID(pid);
        return result;
    };

    editProductByUserOwner = async (pid, uid, newProduct) => {
        const result = await this.dao.editProductByUserOwner(pid, uid, newProduct);
        return result;
    };

    editProductByAdmin = async (pid, newProduct) => {
      const result = await this.dao.editProductByAdmin(pid, newProduct);
      return result;
    };

    deleteProductByUserOwner = async (pid, uid) => {
        let result = await this.dao.deleteProductByUserOwner(pid, uid);
        return result;
    };
};