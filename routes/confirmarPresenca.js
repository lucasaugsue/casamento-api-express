const express = require('express');
const router = express.Router();

/* postgres sql */
require('dotenv').config();
const { sql } = require('@vercel/postgres');
const connectionString = process.env.POSTGRES_URL;

function validacaoConfirmarPresenca (params) {
	try{
		if(!params.nome) throw new Error("É preciso do nome!") 
		if(!params.celular) throw new Error("É preciso do celular!") 
		if(!params.idade) throw new Error("É preciso da idade!")

		return {error: false, msg: "ok"}
	}catch(err){

		return {error: true, msg: err}
	}

}

router.get('/list', async function(req, res, next) {
	try{
		const result = await sql`select * from confirmar_presenca`;
		res.json(result.rows)

	}catch(err) {
        res.status(500).json({ error: err.message });
	}
});

router.get('/by/:id', async function(req, res, next) {
    const id = req.params.id;

    try {
        const result = await sql`SELECT * FROM confirmar_presenca WHERE id = ${id}`;
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Presença não encontrado.' });
        }

        res.json({ item: result.rows[0] });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/create', async function(req, res, next) {
	try {
		const { nome, idade, celular } = req.body;

		let validacao = {error: false, msg: ""}

		validacao = validacaoConfirmarPresenca(req.body)
		if(validacao.error) throw new Error(validacao.msg)

        const item = await sql`INSERT INTO confirmar_presenca (idade, celular, nome) VALUES (${idade}, ${celular}, ${nome}) RETURNING *`;

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
		const { nome, idade, celular } = req.body;

		let validacao = {error: false, msg: ""}

		validacao = validacaoConfirmarPresenca(req.body)
		if(validacao.error) throw new Error(validacao.msg)

        const result = await sql`UPDATE confirmar_presenca SET nome = ${nome}, idade = ${idade}, celular = ${celular} WHERE id = ${id} RETURNING *`;
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Presença não encontrado.' });
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
        const result = await sql`DELETE FROM confirmar_presenca WHERE id = ${id} RETURNING *`;
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Presença não encontrado.' });
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
