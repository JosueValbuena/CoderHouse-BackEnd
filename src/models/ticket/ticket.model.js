import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const ticketCollection = 'tickes';

const ticketSchema = new mongoose.Schema({
    code: { type: ObjectId, default: () => new mongoose.Types.ObjectId() },
    purchase_dateTime: { type: Date, default: new Date() },
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

const ticketModels = mongoose.model(ticketCollection, ticketSchema);

export default ticketModels;