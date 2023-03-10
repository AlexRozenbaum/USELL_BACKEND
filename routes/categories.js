const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { validateCategory, CategoryModel } = require("../models/categoryModel");
const router = express.Router();

router.get("/", async (req, res) => {
  let perPage = req.query.perPage || 99;
  let page = req.query.page || 1;

  try {
    let data = await CategoryModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      // .sort({_id:-1}) like -> order by _id DESC
      .sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});

router.get("/byId/:id", async (req, res) => {
  try {
    let data = await CategoryModel.findOne({ _id: req.params.id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});

router.patch("/:category_urlEdit", authAdmin, async (req, res) => {
  try {
    let category_urlEdit = req.params.category_urlEdit;
    let data = await CategoryModel.updateOne(
      { category_url: category_urlEdit },
      { $set: req.body }
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.post("/", authAdmin, async (req, res) => {
  let validBody = validateCategory(req.body);
  if (validBody.error) {
    res.status(400).json(validBody.error.details);
  }
  try {
    let category = new CategoryModel(req.body);
    await category.save();
    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.delete("/:category_urlDel", authAdmin, async (req, res) => {
  try {
    let category_urlDel = req.params.category_urlDel;
    let data = await CategoryModel.deleteOne({ category_url: category_urlDel });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

module.exports = router;
