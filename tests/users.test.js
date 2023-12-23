// __tests__/users.test.js
const request = require('supertest');
const app = require('../app'); // Importe sua aplicação Express

let id = ""
const objExpect = {
    id: expect.any(Number),
    created: expect.any(String),
    sexo: expect.any(String),
    nome: expect.any(String),
    idade: expect.any(String),
    updated: expect.any(String),
}
describe.only('Testando as rotas relacionado a /users', () => {

    test('POST /users/create cria um novo usuário', async () => {
        const params = {
            nome: 'Novo Usuário',
            idade: '25',
            sexo: 'feminino',
        };
    
        const response = await request(app)
        .post('/users/create')
        .send(params);

        id = response.body.item.id
    
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Criado com sucesso!');
        expect(response.body.item).toEqual(expect.objectContaining(objExpect));
    });

    test("PATCH /users/edit/:id atualiza um usuário existente", async () => {
        const params = {
            nome: 'Novo Usuário',
            idade: '31',
            sexo: 'feminino',
        };

        const response = await request(app)
        .patch(`/users/edit/${id}`)
        .send(params);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Editado com sucesso!');
        expect(response.body.item).toEqual(expect.objectContaining(objExpect));
    });

    test('GET /users/list retorna uma lista de usuários', async () => {
        const response = await request(app).get('/users/list');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining(objExpect),
        ]));

    }, 30000);

    test('GET /users/by/:id retorna um item específico dos usuários', async () => {
        const response = await request(app).get(`/users/by/${id}`);

        expect(response.status).toBe(200);
        expect(response.body.item).toEqual(expect.objectContaining(objExpect));
    });

    test('DELETE /users/delete/:id exclui um usuário existente', async () => {
    
        const response = await request(app)
        .delete(`/users/delete/${id}`);
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Deletado com sucesso!');
    });
    
})
