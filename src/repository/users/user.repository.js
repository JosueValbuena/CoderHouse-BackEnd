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

    getUserByID = async (id) => {
        let result = await this.dao.getUserByID(id);
        return result
    };

    getCurrentUser = async (email) => {
        let result = await this.dao.getCurrentUser(email);
        return result;
    };

    verifyEmail = async (email) => {
        let result = await this.dao.verifyEmail(email);
        return result;
    };

    passwordRecovery = async (email, newPassword) => {
        let result = await this.dao.passwordRecovery(email, newPassword);
        return result;
    };

    userRolePremium = async (uid, role) => {
        let result = await this.dao.userRolePremium(uid, role);
        return result;
    };

    postFile = async (uid, fileName, fileReference) => {
        let result = await this.dao.postFile(uid, fileName, fileReference);
        return result;
    };

    inactiveUsers = async () => {
        const result = await this.dao.inactiveUsers();
        return result;
    };
};