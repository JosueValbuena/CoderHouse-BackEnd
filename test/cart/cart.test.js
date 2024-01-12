import supertest from "supertest";
import Assert from "assert";

const assert = Assert.strict;
const baseURL = '/api/carts/';
const requester = supertest('http://localhost:3001');

describe('Testing Carts Module', () => {

    it('Mostrar todos los carritos, EP GET /allcarts', async () => {
        const { statusCode, ok, _body } = await requester.get(`${baseURL}/allcarts`);
        assert.ok(ok, 'Consulta exitosa');
        assert.strictEqual(statusCode, 200, 'Status Code Correcto');
        assert.strictEqual(typeof _body.payload, 'object', 'Tipo de dato correcto');
    });

    it('Mostrar carrito de un usuario, EP GET /usercart/:uid', async () => {
        const uid = '651cc4cff298139950c36fbf';
        const { statusCode, ok, _body } = await requester.get(`${baseURL}/usercart/${uid}`);
        assert.ok(ok, 'Consulta exitosa');
        assert.strictEqual(statusCode, 200, 'Status Code Correcto');
        assert.strictEqual(typeof _body.payload, 'object', 'Tipo de dato correcto');
    });
});