import supertest from "supertest";
import Assert from 'assert';

const assert = Assert.strict;
const baseUrl = '/api/products/';
const requester = supertest('http://localhost:3001');

describe('Testing Products Module', () => {
    it('Mostrar todos los productios, EP GET /all', async () => {
        const { statusCode, ok, _body } = await requester.get(`${baseUrl}all`);
        console.log(typeof (_body.payload.docs))
        assert.ok(ok, 'Solicitud exitosa');
        assert.strictEqual(statusCode, 200, 'Status Code Correcto');
        assert.strictEqual(typeof _body.payload.docs, 'object', 'Tipo de dato correcto');
    });

    it('Mostrar un producto por el ID, EP /:pid', async () => {
        const pid = '65249af160be30645b3b4de6';

        const { statusCode, ok, _body } = await requester.get(`${baseUrl}${pid}`);

        assert.ok(ok, 'Solicitud exitosa');
        assert.strictEqual(statusCode, 200, 'Status Code Correcto');
        assert.strictEqual(typeof _body.payload, 'object', 'Tipo de dato correcto');
    });

    it('Crear un producto, EP /create', async () => {
        const productMock = {
            title: 'ProductName_Test',
            description: 'ProductDescription_Test',
            code: 'ProductCode_Test',
            price: 9999,
            stock: 9,
            category: 'Product Category_Test',
            user: '659ee640d36e625d38222bc9'
        };

        const { statusCode, ok, _body } = await requester.post(`${baseUrl}/create`).send(productMock);

        assert.ok(ok, 'Solicitud Exitosa');
        assert.strictEqual(statusCode, 201, 'Status code Correcto');
        assert.strictEqual(typeof _body.payload, 'object', 'Tipo de dato correcto');
    });
});