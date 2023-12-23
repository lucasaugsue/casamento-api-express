// __tests__/presentes.test.js
const request = require('supertest');
const app = require('../app'); // Importe sua aplicação Express

let id = ""
const objExpect = {
    id: expect.any(Number),
    url: expect.any(String),
    nome: expect.any(String),
    preco: expect.any(String),
    descricao: expect.any(String),
    mais_informacoes: expect.any(String),
    created: expect.any(String),
    updated: expect.any(String),
}

describe.only('Testando as rotas relacionado a /presentes', () => {

    test('POST /presentes/create cria um novo presente', async () => {
        const params = {
            "nome": "Cama de casal nipon",
            "descricao": "Uma cama de casal criada e projetada da NiponFlex que vai trazer conforto e saúde para os seus usuários.",
            "preco": "11000",
            "mais_informacoes": "https://nipponbrasil.com.br/colchoes-linha-smart/?gad_source=1&gclid=Cj0KCQiA6vaqBhCbARIsACF9M6kgKj007LNe9ttMQJIpUmoY8EeQ7cKsPjGWpEqeiU-EqLSDS5KCAZUaAjGxEALw_wcB",
            "url": "https://nipponbrasil.com.br/wp-content/webp-express/webp-images/uploads/2021/11/1-3-768x546.jpg.webp"
        };
      
        const response = await request(app)
        .post('/presentes/create')
        .send(params);
    
        id = response.body.item.id
      
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Criado com sucesso!');
        expect(response.body.item).toEqual(expect.objectContaining(objExpect));
    });
    
    test("PATCH /presentes/edit/:id atualiza um presente existente", async () => {
        const params = {
            "nome": "Cama de casal nipon (nome editado)",
            "descricao": "Uma cama de casal criada e projetada da NiponFlex que vai trazer conforto e saúde para os seus usuários.",
            "preco": "10000",
            "mais_informacoes": "https://nipponbrasil.com.br/colchoes-linha-smart/?gad_source=1&gclid=Cj0KCQiA6vaqBhCbARIsACF9M6kgKj007LNe9ttMQJIpUmoY8EeQ7cKsPjGWpEqeiU-EqLSDS5KCAZUaAjGxEALw_wcB",
            "url": "https://nipponbrasil.com.br/wp-content/webp-express/webp-images/uploads/2021/11/1-3-768x546.jpg.webp"
        };
    
        const response = await request(app)
        .patch(`/presentes/edit/${id}`)
        .send(params);
    
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Editado com sucesso!');
        expect(response.body.item).toEqual(expect.objectContaining(objExpect));
    });

    test('GET /presentes/list retorna uma lista de presentes', async () => {
        const response = await request(app).get('/presentes/list');
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining(objExpect),
        ]));
    
    }, 30000);
    
    test('GET /presentes/by/:id retorna um item específico dos presentes', async () => {
        const response = await request(app).get(`/presentes/by/${id}`);
    
        expect(response.status).toBe(200);
        expect(response.body.item).toEqual(expect.objectContaining(objExpect));
    });
    
    test('DELETE /presentes/delete/:id exclui um presente existente', async () => {
      
        const response = await request(app)
        .delete(`/presentes/delete/${id}`);
      
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Deletado com sucesso!');
    });
    
})
