var md5 = require('md5');
var express = require('express');
var router = express.Router();
var { v4: uuidv4 } = require('uuid');

const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("drab-cyan-cockatoo-wrapCyclicDB")

const recados = db.collection("recados")

function validacaoRecados (params) {
	try{
		if(!params.nome) throw new Error("É preciso do nome!") 
		if(!params.email) throw new Error("É preciso do email!")
		if(!params.recado) throw new Error("É preciso do recado!")
		
		return {error: false, msg: "ok"}
	}catch(err){

		return {error: true, msg: err}
	}

}

router.get('/list', async function(req, res, next) {
	try{
		const { results: recadosMetadata } = await recados.list();
		const list = await Promise.all(
			recadosMetadata.map(async ({ key }) => (
				await recados.get(key)).props
			) 
		);

		res.json(list)

	}catch(err) {
		res.send(`${err}`)
	}
});

router.get('/by/:id', async function(req, res, next) {
	try{
		let id = req.params.id
		let item = (await recados.get(id)).props

		res.json({ item: item })

	}catch(err) {
		res.send(`${err}`)
	}
})

router.post('/create', async function(req, res, next) {
	try{
		let uuid = uuidv4()
		let id = md5(uuid)

		let params = {...req.body}
		let validacao = {error: false, msg: ""}

		params = {
			id: id,
			nome: params.nome || "",
			email: params.email || "",
			recado: params.recado || "",
		}

		validacao = validacaoRecados(params)
		if(validacao.error) throw new Error(validacao.msg)
		
		await recados.set(id, params)
		let item = await recados.get(id)

		res.status(201)
		res.json({
			item: item,
			message: 'Criado com sucesso!'
		})

	}catch(err) {
		res.send(`${err.message}`)
	}
});

router.patch('/edit/:id', async function(req, res, next) {
	try{
		let params = {...req.body}
		let id = req.params.id
		let validacao = {error: false, msg: ""}

		let item = await recados.get(id)
		if(!item) throw new Error("Não foi possível encontrar o id para editar!")

		params = {
			id: id,
			nome: params.nome || "",
			email: params.email || "",
			recado: params.recado || "",
		}
		
		validacao = validacaoRecados(params)
		if(validacao.error) throw new Error(validacao.msg)

		await recados.set(id, params)

		res.status(200)
		res.json({
			item: item,
			message: 'Editado com sucesso!'
		})

	}catch(err) {
		res.send(`${err}`)
	}
});

router.delete('/delete/:id', async function(req, res, next) {
	try{
		let id = req.params.id
		
		let item = await recados.get(id)
		if(!item) throw new Error("Não foi possível encontrar o id para deletar!")
		
		await recados.delete(id)

		res.json({ message: 'Deletado com sucesso!' })

	}catch(err) {
		res.send(`${err}`)
	}
}); 

module.exports = router;
