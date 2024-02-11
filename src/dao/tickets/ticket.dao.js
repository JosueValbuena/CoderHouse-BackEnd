import cartsModels from "../../models/carts/carts.models.js";
import productsModel from "../../models/products/products.models.js";
import ticketModels from "../../models/ticket/ticket.model.js";

export default class Ticket {

    getTicket = async (phid, uid) => {
        try {
            let result = await ticketModels.find({ _id: phid, user: uid })
                .populate('products.product');
            if (!result) return { status: 'Error', message: 'El ticket no existe' };
            return result;
        } catch (error) {
            throw new Error(' Error al buscar el ticket' + error.message);
        };
    };

    createTicket = async (uid, cid) => {
        try {
            const cart = await cartsModels.find({ _id: cid });

            const products = [];

            cart.forEach((ele) => {
                for (const producto of ele.products) {
                    if (producto.product.stock < producto.qty) return {
                        status: 'Error',
                        message: 'No hay stock suficiente'
                    };
                    products.push(producto);
                };
            });

            const newTicket = {
                user: uid,
                amount: 1000,
                products: products
            };

            let result = await ticketModels.create(newTicket);
            if (result._id) await cartsModels.deleteOne({ _id: cid });
            return result;
        } catch (error) {
            throw new Error(' Error al crear el ticket: ' + error.message);
        }
    };
};