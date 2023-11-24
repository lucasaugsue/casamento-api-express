var md5 = require('md5');
var express = require('express');
var router = express.Router();
var { v4: uuidv4 } = require('uuid');

const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("drab-cyan-cockatoo-wrapCyclicDB")

const confirmar_presenca = db.collection("confirmar_presenca")

function validacaoConfirmarPresenca (params) {
	try{
		if(!params.nome) throw new Error("É preciso do nome!") 
		if(!params.email) throw new Error("É preciso do email!")
		if(!params.lista) throw new Error("É preciso adicionar pessoas na lista!")
		if(params.lista.length < 1) throw new Error("É preciso adicionar pessoas na lista!")

        let nomeError = params.lista.find(i => !i.nome || i.nome.length < 1)
		if(nomeError) throw new Error("Alguem na lista está sem nome!")

        let idadeError = params.lista.find(i => !i.idade || i.idade.length < 1)
		if(idadeError) throw new Error("Alguem na lista está sem idade!")

		return {error: false, msg: "ok"}
	}catch(err){

		return {error: true, msg: err}
	}

}

router.get('/list', async function(req, res, next) {
	try{
		const { results: confirmarPresencaMetadata } = await confirmar_presenca.list();
		const list = await Promise.all(
			confirmarPresencaMetadata.map(async ({ key }) => (
				await confirmar_presenca.get(key)).props
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
		let item = (await confirmar_presenca.get(id)).props

		res.json(item)

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
			lista: params.lista || [],
		}

		validacao = validacaoConfirmarPresenca(params)
		if(validacao.error) throw new Error(validacao.msg)
		
		await confirmar_presenca.set(id, params)
		let item = await confirmar_presenca.get(id)

		// console.log("item", item)

		res.send('Criado com sucesso!')

	}catch(err) {
		res.send(`${err.message}`)
	}
});

router.patch('/edit/:id', async function(req, res, next) {
	try{
		let params = {...req.body}
		let id = req.params.id
		let validacao = {error: false, msg: ""}

		let item = await confirmar_presenca.get(id)
		if(!item) throw new Error("Não foi possível encontrar o id para editar!")
		// console.log("item", item)

		params = {
			id: id,
			nome: params.nome || "",
			email: params.email || "",
			lista: params.lista || [],
		}
		
		validacao = validacaoConfirmarPresenca(params)
		if(validacao.error) throw new Error(validacao.msg)

		await confirmar_presenca.set(id, params)

		res.send('Editado com sucesso!')

	}catch(err) {
		res.send(`${err}`)
	}
});

router.delete('/delete/:id', async function(req, res, next) {
	try{
		let id = req.params.id
		
		let item = await confirmar_presenca.get(id)
		if(!item) throw new Error("Não foi possível encontrar o id para deletar!")
		
		await confirmar_presenca.delete(id)

		res.send('Deletado com sucesso!')

	}catch(err) {
		res.send(`${err}`)
	}
}); 

module.exports = router;
