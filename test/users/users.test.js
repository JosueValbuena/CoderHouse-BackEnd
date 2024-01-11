import supertest from "supertest";
import Assert from "assert";

const assert = Assert.strict;
const baseUrl = '/api/users/';
const requester = supertest('http://localhost:3001');

describe('Testing Users Module', () => {
    it('Mostrar usuario por ID, EP GET /user/:id', async () => {
        const uid = '654ad1fd5dadbb34fd187877';

        const { statusCode, ok, _body } = await requester.get(`${baseUrl}user/${uid}`);

        assert.ok(ok, 'Solicitud exitosa');
        assert.equal(statusCode, 200, 'Estatus code correcto');
        assert.strictEqual(typeof _body, 'object', 'Tipo de dato correcto');
    });

    /*      it('Registro de usuario, EP POST /register', async () => {
             const userMock = {
                 first_name: 'User FN Test',
                 last_name: 'User LN Test',
                 email: 'Test@email.com',
                 age: 30,
                 password: 'usertest'
             };
 
             const { statusCode, ok, _body } = await requester.post(baseUrl + '/register').send(userMock);
 
             assert.ok(ok, 'Solicitud exitosa');
             assert.equal(statusCode, 201, 'Estatus code correcto');
             assert.strictEqual(_body, 'Success', 'Usuario creado con exito');
         }) 
         
         ESTE TEST FUNCIONA, PERO DEBE CAMBIARSE EL EMAIL O DARA ERROR POR EMAIL DUPLICADO EN BB.DD
         */

    it('Autenticacion de usuario, EP POST /login', async () => {
        const userMock = {
            email: 'Test@email.com',
            password: 'usertest'
        };

        const { statusCode, ok, _body } = await requester.post(`${baseUrl}login`).send(userMock);

        assert.ok(ok, 'Solicitud exitosa');
        assert.equal(statusCode, 200, 'Estatus code correcto');
        assert.ok(_body.token, 'Autenticado con exito creado con exito');
    });

    it('Cambio de rol de usuario, EP PUT /user-role/premium/:uid', async () => {
        const uid = '659ee640d36e625d38222bc9';
        const role = 'admin';
        const { statusCode, ok, _body } = await requester.put(`${baseUrl}user-role/premium/${uid}`).send({ role });
        assert.ok(ok, 'Solicitud exitosa');
        assert.equal(statusCode, 200, 'Estatus code correcto');
    });
});
