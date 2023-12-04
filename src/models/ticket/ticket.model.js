import mongoose from "mongoose";

const ticketCollection = 'tickes';

const ticketSchema = new mongoose.Schema({
    code: new ObjectId(),
    purchase_dateTime: new Date(),
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    amount: Number,
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            qty: { type: Number, required: true }
        }
    ]
});

const ticketModel = new mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;