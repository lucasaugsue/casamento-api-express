// __tests__/recados.test.js
const request = require('supertest');
const app = require('../app'); // Importe sua aplicação Express

let id = ""
const objExpect = {
    id: expect.any(Number),
    recado: expect.any(String),
    nome: expect.any(String),
    email: expect.any(String),
    created: expect.any(String),
    updated: expect.any(String),
}

describe.only('Testando as rotas relacionado a /recados', () => {

    test('POST /recados/create cria um novo recado', async () => {
        const params = {
            nome: "lucas augsue",
            email: "lucasaugsue7@gmail.com",
            recado: "lorem ipslum texto hehe"
        };
      
        const response = await request(app)
        .post('/recados/create')
        .send(params);
    
        id = response.body.item.id
      
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Criado com sucesso!');
        expect(response.body.item).toEqual(expect.objectContaining(objExpect));
    });
    
    test("PATCH /recados/edit/:id atualiza um recado existente", async () => {
        const params = {
            nome: "lucas augsue editado",
            email: "lucasaugsue7@gmail.com",
            recado: "mudando o recado"
        };
    
        const response = await request(app)
        .patch(`/recados/edit/${id}`)
        .send(params);
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Editado com sucesso!');
        expect(response.body.item).toEqual(expect.objectContaining(objExpect));
    });
    
    test('GET /recados/list retorna uma lista de recados', async () => {
        const response = await request(app).get('/recados/list');
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining(objExpect),
        ]));
    
    }, 30000);
    
    test('GET /recados/by/:id retorna um item específico dos recados', async () => {
        const response = await request(app).get(`/recados/by/${id}`);
    
        expect(response.status).toBe(200);
        expect(response.body.item).toEqual(expect.objectContaining(objExpect));
    });
    
    test('DELETE /recados/delete/:id exclui um recado existente', async () => {
      
        const response = await request(app)
        .delete(`/recados/delete/${id}`);
      
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Deletado com sucesso!');
    });

})
