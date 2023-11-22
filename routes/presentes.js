var md5 = require('md5');
var express = require('express');
var router = express.Router();

const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("drab-cyan-cockatoo-wrapCyclicDB")

const presentes = db.collection("presentes")

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
		let list = await presentes.list(99)
		let tmp = []

		list = await (list.results || []).reduce(async (old, curr) =>  {
			let item = await presentes.get(curr.key)
			tmp.push({
				key: item.key,
				nome: item.props.nome,
				preco: item.props.preco,
				descricao: item.props.descricao,
				url: item.props.url,
				updated: item.props.updated,
				created: item.props.created,
			})

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
		let item = await presentes.get(key)

		res.json(item)

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
})

router.post('/create', async function(req, res, next) {
	try{
		let params = {...req.body}
		let key = md5(params.nome)
		let validacao = {error: false, msg: ""}
		
		validacao = validacaoPresente(params)
		if(validacao.error) throw new Error(validacao.msg)
		
		await presentes.set(key, params)
		let item = await presentes.get(key)

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
		let validacao = {error: false, msg: ""}
		
		validacao = validacaoPresente(params)
		if(validacao.error) throw new Error(validacao.msg)

		await presentes.set(key, params)
		let item = await presentes.get(key)

		// console.log("item", item)

		res.send('Editado com sucesso!')

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
});

router.delete('/delete/:key', async function(req, res, next) {
	try{
		let key = req.params.key
		await presentes.delete(key)

		res.send('Deletado com sucesso!')

	}catch(err) {
		res.send(`Um erro aconteceu: ${err}`)
	}
}); 

module.exports = router;
