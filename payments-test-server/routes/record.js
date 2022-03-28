const express = require("express");

const recordRoutes = express.Router();

const dbo = require("../db/conn");

recordRoutes.route("/addCardInfo").post(function (req, res) {
  const dbConnect = dbo.getDb();
  const cardDocument = {
    card_number: req.body.CardNumber,
    exp_date: req.body.ExpDate,
    cvv: req.body.Cvv,
    amount: req.body.Amount,
  };

  dbConnect
    .collection("cards")
    .insertOne(cardDocument, function (err, result) {
      if (err) {
        res.status(400).send("Error inserting card info!");
      } else {
        console.log({ RequestId: result.insertedId, Amount: req.body.Amount });
        res.status(204).send();
      }
    });
});

module.exports = recordRoutes;
