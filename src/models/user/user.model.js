import mongoose from "mongoose";

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: String,
    email: {type: String, required: true},
    age: Number,
    password: String,
    role: String
});

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;