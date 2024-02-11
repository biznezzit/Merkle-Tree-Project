const express = require('express');
const verifyProof = require('../utils/verifyProof');
const niceList = require('../utils/niceList');
const MerkleTree = require('../utils/MerkleTree');

const port = 1225;

const app = express();
app.use(express.json());

// create the merkle tree for the whole nice list
const merkleTree = new MerkleTree(niceList);

// TODO: hardcode a merkle root here representing the whole nice list
// paste the hex string in here, without the 0x prefix
const MERKLE_ROOT = merkleTree.getRoot();
// console.log(MERKLE_ROOT);

app.post('/gift', (req, res) => {
  // grab the parameters from the front-end here
  const name = req.body;

  // TODO: prove that a name is in the list 
  const index = niceList.findIndex(n => n === name.name[0]);
  // console.log(index);
  const proof = merkleTree.getProof(index);  
  // console.log(proof)
  const isInTheList = verifyProof(proof, name.name[0], MERKLE_ROOT);
  // console.log(isInTheList);

  if(isInTheList) {
    res.send("You got a toy robot!");
  }
  else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
