import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("categories");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single category by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("categories");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new category.
router.post("/", async (req, res) => {
  let newDocument = {
    title: req.body.title,
    uuid: req.body.uuid,
  };
  let collection = await db.collection("categories");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// This section will help you delete a category
router.delete("/:id", async (req, res) => {
  try{
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("categories");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch(error) {
    console.log('Error while deleting object id ' + req.params.id);
    res.send("Not found").status(404);
  }
});

export default router;