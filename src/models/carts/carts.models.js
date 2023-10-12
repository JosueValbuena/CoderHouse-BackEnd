import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            qty: { type: Number, required: true }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})

cartsSchema.pre('find', function(){
    this.populate('products.product')
})

const cartsModels = mongoose.model(cartsCollection, cartsSchema);

export default cartsModels;

