export default class UsersRepository {
    constructor(dao) {
        this.dao = dao
    };

    getAllUsers = async () => {
        let result = await this.dao.getAllUsers();
        return result;
    };

    registerUser = async (first_name, last_name, email, age, password, role) => {
        let result = await this.dao.registerUser(first_name, last_name, email, age, password, role);
        return result;
    };

    loginUser = async (email, password) => {
        let result = await this.dao.loginUser(email, password);
        return result;
    };

    getUserByID = async (id, req) => {
        let result = await this.dao.getUserByID(id);
        return result
    };

    getCurrentUser = async (email) => {
        let result = await this.dao.getCurrentUser(email);
        return result;
    };
};