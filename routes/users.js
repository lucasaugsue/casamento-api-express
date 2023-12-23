const express = require('express');
const router = express.Router();

/* postgres sql */
require('dotenv').config();
const { sql } = require('@vercel/postgres');
const connectionString = process.env.POSTGRES_URL;

router.get('/list', async function(req, res, next) {
	try{
		const result = await sql`select * from users`;
		res.json(result.rows)

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
});

router.get('/by/:id', async function(req, res, next) {
    const id = req.params.id;

    try {
        const result = await sql`SELECT * FROM users WHERE id = ${id}`;
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json({ item: result.rows[0] });

    } catch (err) {
        res.status(500).json({ error: `Um erro aconteceu: ${err}` });
    }
});

router.post('/create', async function(req, res, next) {
    try {
        const { nome, sexo, idade } = req.body;
        const item = await sql`INSERT INTO users (sexo, idade, nome) VALUES (${sexo}, ${idade}, ${nome}) RETURNING *`;

        res.status(201).json({
            item: item.rows[0],
            message: 'Criado com sucesso!'
        });

    } catch (err) {
        res.status(500).json({ error: `Um erro aconteceu: ${err}` });
    }
});

router.patch('/edit/:id', async function(req, res, next) {
    const id = req.params.id;
    const { nome, sexo, idade } = req.body;

    try {
        const result = await sql`UPDATE users SET nome = ${nome}, sexo = ${sexo}, idade = ${idade} WHERE id = ${id} RETURNING *`;
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json({ 
            item: result.rows[0],
            message: 'Editado com sucesso!'
        });

    } catch (err) {
        res.status(500).json({ error: `Um erro aconteceu: ${err}` });
    }
});

router.delete('/delete/:id', async function(req, res, next) {
    const id = req.params.id;

    try {
        const result = await sql`DELETE FROM users WHERE id = ${id} RETURNING *`;
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json({ 
            item: result.rows[0],
            message: 'Deletado com sucesso!'
        });

    } catch (err) {
        res.status(500).json({ error: `Um erro aconteceu: ${err}` });
    }
});

module.exports = router;
