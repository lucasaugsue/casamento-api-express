const express = require('express');
const router = express.Router();

/* postgres sql */
require('dotenv').config();
const { sql } = require('@vercel/postgres');
const connectionString = process.env.POSTGRES_URL;

function validacaoPresente (params) {
	try{
		if(!params.nome) throw new Error("É preciso do nome!") 
		if(!params.url) throw new Error("É preciso da url!")
		if(!params.preco) throw new Error("É preciso do preço!")
		if(!params.descricao) throw new Error("É preciso da descrição!")
		
		return {error: false, msg: "ok"}
	}catch(err){

		return {error: true, msg: err}
	}

}

router.get('/list', async function(req, res, next) {
	try{
		const result = await sql`select * from presentes`;
		res.json(result.rows)

	}catch(err) {
        res.status(500).json({ error: err.message });
	}
});

router.get('/by/:id', async function(req, res, next) {
    const id = req.params.id;

    try {
        const result = await sql`SELECT * FROM presentes WHERE id = ${id}`;
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Presente não encontrado.' });
        }

        res.json({ item: result.rows[0] });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/create', async function(req, res, next) {
	try {
		const { nome, preco, descricao, mais_informacoes, url } = req.body;

		let validacao = {error: false, msg: ""}

		validacao = validacaoPresente(req.body)
		if(validacao.error) throw new Error(validacao.msg)

        const item = await sql`INSERT INTO presentes (preco, descricao, nome, mais_informacoes, url) VALUES (${preco}, ${descricao}, ${nome}, ${mais_informacoes}, ${url}) RETURNING *`;

        res.status(201).json({
            item: item.rows[0],
            message: 'Criado com sucesso!'
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/edit/:id', async function(req, res, next) {
	try {
		const id = req.params.id;
		const { nome, preco, descricao, mais_informacoes, url } = req.body;

		let validacao = {error: false, msg: ""}

		validacao = validacaoPresente(req.body)
		if(validacao.error) throw new Error(validacao.msg)

        const result = await sql`UPDATE presentes SET nome = ${nome}, preco = ${preco}, descricao = ${descricao}, mais_informacoes = ${mais_informacoes}, url = ${url} WHERE id = ${id} RETURNING *`;
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Presente não encontrado.' });
        }

		res.json({ 
            item: result.rows[0],
            message: 'Editado com sucesso!'
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/delete/:id', async function(req, res, next) {
    const id = req.params.id;

    try {
        const result = await sql`DELETE FROM presentes WHERE id = ${id} RETURNING *`;
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Presente não encontrado.' });
        }

        res.json({ 
            item: result.rows[0],
            message: 'Deletado com sucesso!'
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
