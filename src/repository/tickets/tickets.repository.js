export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    };

    getTicket = async (phid, uid) => {
        let result = await this.dao.getTicket(phid, uid);
        return result;
    };

    createTicket = async (uid, cid) => {
        let result = await this.dao.createTicket(uid, cid);
        return result
    };
} 