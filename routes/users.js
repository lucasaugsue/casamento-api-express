var md5 = require('md5');
var express = require('express');
var router = express.Router();

const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("drab-cyan-cockatoo-wrapCyclicDB")

const users = db.collection("users")

router.get('/list', async function(req, res, next) {
	try{
		let list = await users.list(99)
		let tmp = []

		list = await (list.results || []).reduce(async (old, curr) =>  {
			let item = await users.get(curr.key)
			tmp.push(item)

			old = tmp
			return old 
		}, [])

		res.json(list)

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
});

router.get('/by/:key', async function(req, res, next) {
	try{
		let key = req.params.key
		let item = await users.get(key)

		res.json(item)

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
})

router.post('/create', async function(req, res, next) {
	try{
		let params = {...req.body}
		let key = md5(params.nome)

		await users.set(key, params)
		let item = await users.get(key)

		// console.log("item", item)

		res.send('Criado com sucesso!')

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
});

router.patch('/edit/:key', async function(req, res, next) {
	try{
		let params = {...req.body}
		let key = req.params.key

		await users.set(key, params)
		let item = await users.get(key)

		// console.log("item", item)

		res.send('Editado com sucesso!')

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
});

router.delete('/delete/:key', async function(req, res, next) {
	try{
		let key = req.params.key
		await users.delete(key)

		res.send('Deletado com sucesso!')

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
}); 

module.exports = router;
