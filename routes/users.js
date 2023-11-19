var express = require('express');
var router = express.Router();

const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("weak-tuna-attireCyclicDB")

const animals = db.collection("animals")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/teste', async function(req, res, next) {
  // res.send(`apenas testando uma nova rota!`);

  // create an item in collection with key "leo"
  let leo = await animals.set("leo", {
    type: "cat",
    color: "orange"
  })
  
  // get an item at key "leo" from collection animals
  let item = await animals.get("leo")
  console.log("item", {...item})

  res.send(`resposta: ${item}`)
});

module.exports = router;
