import { isValidObjectId } from "mongoose";
import { cartsService } from "../../repository/index.repository.js";

export const getAllCarts = async (req, res) => {
    try {
        const result = await cartsService.getAllCarts();
        if (!result) return res.status(404).json({ status: result.status, message: result.message });
        res.status(200).json({ status: 'Success', message: 'Carts encontradas con exito', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message });
    };
};

export const getUserCart = async (req, res) => {
    try {
        const { uid } = req.params;
        const validId = isValidObjectId(uid);
        if (!validId) return res.status(401).json({ status: 'Error', message: 'ID de usuario no valido' });
        const result = await cartsService.getUserCart(uid);
        if (result.status === 'Error') return res.status(404).json({ status: result.status, message: result.message });
        res.status(200).json({ status: 'Success', message: 'Carrito de usuario encontrato correctamente', payload: result });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message });
    };
};