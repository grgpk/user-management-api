const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { getDb } = require("../db/db");
const getCount = require("../db/count");

router.get("/", async function (req, res) {
  // current page
  const page = req.query.page || 0;
  const limit = 5;
  let total = await getCount("userStatuses");
  getDb()
    .collection("userStatuses")
    .find()
    .sort()
    .skip(page * limit)
    .limit(limit)
    .toArray()
    .then((statuses) => {
      res.status(200).json({ statuses, total, limit });
    })
    .catch((err) => {
      res.status(500).json({ error: "Cannot fetch statuses" });
    });
});

router.post("/add", (req, res) => {
  const status = req.body;

  getDb()
    .collection("userStatuses")
    .insertOne(status)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not add new status" });
    });
});

router.delete("/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    getDb()
      .collection("userStatuses")
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not delete the status" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document ID" });
  }
});

router.patch("/:id", (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    getDb()
      .collection("userStatuses")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not update the status" });
      });
  } else {
    res.status(500).json({ error: "Not a valid document ID" });
  }
});

module.exports = router;
