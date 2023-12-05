import cartsModels from "../../models/carts/carts.models.js";
import ticketModels from "../../models/ticket/ticket.model.js";

export default class Ticket {

    getTicket = async (id) => {
        try {
            let result = await ticketModels.find({ _id: id });
            if (!result) return { status: 'Error', message: 'El ticket no existe' };
            return result;
        } catch (error) {
            throw new Error(' Error al buscar el ticket' + error.message);
        };
    };

    createTicket = async (uid, cid) => {
        try {
            const cart = await cartsModels.find({ _id: cid });
            console.log(cart)

            const products = [];

            cart.forEach((ele) => {
                for (const producto of ele.products) {
                    products.push(producto)
                };
            })

            const newTicket = {
                user: uid,
                amount: 1000,
                products: products
            };

            console.log(newTicket);

            let result = await ticketModels.create(newTicket);
            return result;
        } catch (error) {
            throw new Error(' Error al crear el ticket: ' + error.message);
        }
    };
};