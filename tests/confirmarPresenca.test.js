// __tests__/confirmarPresenca.test.js
const request = require('supertest');
const app = require('../app'); // Importe sua aplicação Express

let id = ""
const objExpect = {
    id: expect.any(Number),
    nome: expect.any(String),
    celular: expect.any(String),
    idade: expect.any(String),
    created: expect.any(String),
    updated: expect.any(String),
}

describe.only('Testando as rotas relacionado a /confirmar-presenca', () => {

    test('POST /confirmar-presenca/create cria uma nova presença', async () => {
        const params = {
            "nome": "lucas augsue",
            "celular": "(61)98114-6060",
            "idade": "21"
        };
      
        const response = await request(app)
        .post('/confirmar-presenca/create')
        .send(params);
    
        id = response.body.item.id
      
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Criado com sucesso!');
        expect(response.body.item).toEqual(expect.objectContaining(objExpect));
    });
    
    test("PATCH /confirmar-presenca/edit/:id atualiza uma presença existente", async () => {
        const params = {
            "nome": "lucas augsue (editando nome)",
            "celular": "(61)98114-6060",
            "idade": "21"
        };
    
        const response = await request(app)
        .patch(`/confirmar-presenca/edit/${id}`)
        .send(params);
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Editado com sucesso!');
        expect(response.body.item).toEqual(expect.objectContaining(objExpect));
    });
    
    test('GET /confirmar-presenca/list retorna uma lista de presentes', async () => {
        const response = await request(app).get('/confirmar-presenca/list');
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining(objExpect),
        ]));
    
    }, 30000);
    
    test('GET /confirmar-presenca/by/:id retorna um item específico das presenças', async () => {
        const response = await request(app).get(`/confirmar-presenca/by/${id}`);
    
        expect(response.status).toBe(200);
        expect(response.body.item).toEqual(expect.objectContaining(objExpect));
    });
    
    test('DELETE /confirmar-presenca/delete/:id exclui uma presença existente', async () => {
      
        const response = await request(app)
        .delete(`/confirmar-presenca/delete/${id}`);
      
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Deletado com sucesso!');
    });
    
})
