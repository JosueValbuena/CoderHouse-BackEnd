export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    };

    getTicket = async (id) => {
        let result = await this.dao.getTicket(id);
        return result;
    };

    createTicket = async (uid, cid) => {
        let result = await this.dao.createTicket(uid, cid);
        return result
    };
} 