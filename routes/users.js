var md5 = require('md5');
var express = require('express');
var router = express.Router();

const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("weak-tuna-attireCyclicDB")

const users = db.collection("users")

router.get('/list', async function(req, res, next) {
  let list = await users.list(99)
  let tmp = []

  list = await (list.results || []).reduce(async (old, curr) =>  {
    let item = await users.get(curr.key)
    tmp.push(item)

    old = tmp
    return old 
  }, [])

  res.json(list)
});

router.get('/by/:key', async function(req, res, next) {
  let key = req.params.key
  let item = await users.get(key)

  res.json(item)
})

router.post('/create', async function(req, res, next) {
  let params = {...req.body}
  let key = md5(params.nome)

  await users.set(key, params)
  let item = await users.get(key)

  // console.log("item", item)
  
  res.send('Criado com sucesso!')
});

router.patch('/edit/:key', async function(req, res, next) {
  let params = {...req.body}
  let key = req.params.key

  await users.set(key, params)
  let item = await users.get(key)

  // console.log("item", item)

  res.send('Editado com sucesso!')
});

router.delete('/delete/:key', async function(req, res, next) {
  let key = req.params.key
  await users.delete(key)

  res.send('Deletado com sucesso!')
}); 

module.exports = router;
