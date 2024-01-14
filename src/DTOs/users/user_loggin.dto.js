export default class UserLoggin {
    constructor(user) {
        this.name = user.first_name;
        this.role = user.role;
        this.id = user._id;
        this.last_connection = user.last_connection
    }
};