import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {

  let pipeline = [
    {
      $lookup : {
          from : 'categories',
          localField : 'categoryId',
          foreignField : '_id',
          as : 'category'
      }
    },
    {
      // unwind array so we have all as objects
      $unwind: {
          'path': '$category',
          'preserveNullAndEmptyArrays': false,
      },
  },
  {
    $project: {
       title: 1,
       requirements: 1,
       description: 1,
       comments: 1,
       category: 1
    }
  }
  ]

  let collection = await db.collection("records");
  let results = await collection.aggregate(pipeline).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {

  let pipeline = [
    {$match: { _id: new ObjectId(req.params.id) }},
    { $limit: 1 },
    {
      $lookup : {
          from : 'categories',
          localField : 'categoryId',
          foreignField : '_id',
          as : 'category'
      }
    },
    {
      // unwind array so we have all as objects
      $unwind: {
          'path': '$category',
          'preserveNullAndEmptyArrays': false,
      },
  },
  {
    $project: {
       title: 1,
       requirements: 1,
       description: 1,
       comments: 1,
       category: 1
    }
  }
  ]

  let collection = await db.collection("records");
  let results = await collection.aggregate(pipeline).toArray();
  let result = results[0];

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  let newDocument = {
    title: req.body.title,
    requirements: req.body.requirements,
    description: req.body.description,
    categoryId: new ObjectId(req.body.categoryId),
    comments: [],
  };
  if (req.body.comment) newDocument.comments.push(req.body.comment);
  let collection = await db.collection("records");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates =  req.body.comment ? 
    {
      $set: {
        title: req.body.title,
        requirements: req.body.requirements,
        description: req.body.description,
        categoryId: new ObjectId(req.body.categoryId),
      },
      $push: {comments: req.body.comment}
    } : 
    {
      $set: {
        title: req.body.title,
        requirements: req.body.requirements,
        description: req.body.description,
        categoryId: new ObjectId(req.body.categoryId),
      }
    };

    let collection = await db.collection("records");
    let result = await collection.updateOne(query, updates);

    res.send(result).status(200);
  } catch(error) {
    console.log('Error while updating object id ' + req.params.id);
    res.send("Not found").status(404);
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try{
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch(error) {
    console.log('Error while deleting object id ' + req.params.id);
    res.send("Not found").status(404);
  }
});

export default router;