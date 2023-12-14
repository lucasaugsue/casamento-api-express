// __tests__/users.test.js
const request = require('supertest');
const app = require('../app'); // Importe sua aplicação Express

let key = ""
const objUser = {
    altura: expect.any(String),
    created: expect.any(String),
    sexo: expect.any(String),
    nome: expect.any(String),
    idade: expect.any(String),
    updated: expect.any(String),
}

test('GET /users/list retorna uma lista de usuários', async () => {
    const response = await request(app).get('/users/list');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
        expect.objectContaining(objUser),
    ]));

});

test('POST /users/create cria um novo usuário', async () => {
    const userData = {
        nome: 'Novo Usuário',
        idade: '25',
        sexo: 'feminino',
        altura: '1.70',
    };
  
    const response = await request(app)
    .post('/users/create')
    .send(userData);

	key = response.body.item.key
  
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Criado com sucesso!');
    expect(response.body.item.props).toEqual(expect.objectContaining(objUser));
});

test("PATCH /users/edit/:key atualiza um usuário existente", async () => {
	const updatedData = {
		nome: 'Novo Usuário',
        idade: '31',
        sexo: 'feminino',
        altura: '1.72',
	};

	const response = await request(app)
	.patch(`/users/edit/${key}`)
	.send(updatedData);

	expect(response.status).toBe(200);
	expect(response.body.message).toBe('Editado com sucesso!');
	expect(response.body.item.props).toEqual(expect.objectContaining(objUser));
});

test('GET /users/by/:key retorna um item específico dos usuários', async () => {
    const response = await request(app).get(`/users/by/${key}`);

    expect(response.status).toBe(200);
    expect(response.body.item.props).toEqual(expect.objectContaining(objUser));
});

test('DELETE /users/delete/:id exclui um usuário existente', async () => {
  
	const response = await request(app)
	.delete(`/users/delete/${key}`);
  
	expect(response.status).toBe(200);
	expect(response.body.message).toBe('Deletado com sucesso!');
});
