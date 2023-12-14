var md5 = require('md5');
var express = require('express');
var router = express.Router();
var { v4: uuidv4 } = require('uuid');

const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("drab-cyan-cockatoo-wrapCyclicDB")

const users = db.collection("users")

router.get('/list', async function(req, res, next) {
	try{
		const { results: usersMetadata } = await users.list();
		const list = await Promise.all(
			usersMetadata.map(async ({ key }) => (
				await users.get(key)).props
			) 
		);

		res.json(list)

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
});

router.get('/by/:id', async function(req, res, next) {
	try{
		let id = req.params.id
		let item = await users.get(id)

		res.json({ item: item })

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
})

router.post('/create', async function(req, res, next) {
	try{
		let uuid = uuidv4()
		let id = md5(uuid)

		let params = {
			id: id,
			...req.body
		}

		await users.set(id, params)
		let item = await users.get(id)

		res.status(201)
		res.json({
			item: item,
			message: 'Criado com sucesso!'
		})

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
});

router.patch('/edit/:id', async function(req, res, next) {
	try{
		let params = {...req.body}
		let id = req.params.id

		await users.set(id, params)
		let item = await users.get(id)

		res.status(200)
		res.json({
			item: item,
			message: 'Editado com sucesso!'
		})

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
});

router.delete('/delete/:id', async function(req, res, next) {
	try{
		let id = req.params.id
		await users.delete(id)

		res.json({ message: 'Deletado com sucesso!' })

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
}); 

module.exports = router;
