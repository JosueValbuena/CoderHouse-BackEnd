export default class AllUsers {
    constructor(user) {
        this.users = user
    };

    getUsers = () => {
        return this.users.map(user => {
            return {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });
    };
};