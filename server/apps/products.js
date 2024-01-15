import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const name = req.query.keywords;
    const category = req.query.category;

    const query = {};

    if (name) {
      query.name = new RegExp(name, "i");
    }

    if (category === "it" || category === "fashion" || category === "food") {
      query.category = new RegExp(category, "i");
    }

    const collection = db.collection("products");

    const productData = await collection
      .find(query)
      .limit(10)
      .toArray()
      .sort({ created_at: -1 });

    return res.json({
      data: productData,
    });
  } catch (error) {
    return res.json(`${error}`);
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");

    const productId = new ObjectId(req.params.id);
    const productById = await collection.findOne({ _id: productId });
    return res.json({
      data: productById,
    });
  } catch (error) {
    return res.json(`${error}`);
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");

    const productData = { ...req.body, created_at: new Date() };
    const newProductData = await collection.insertOne(productData);

    return res.json({
      message: `Product has been created successfully`,
    });
  } catch (error) {
    return res.json(`${error}`);
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.id);
    const newProduct = { ...req.body };

    await collection.updateOne(
      {
        _id: productId,
      },
      {
        $set: newProduct,
      }
    );

    return res.json({
      message: {
        message: "Product has been updated successfully",
      },
    });
  } catch (error) {
    return res.json(`${error}`);
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productsId = new ObjectId(req.params.id);

    await collection.deleteOne({
      _id: productsId,
    });

    return res.json({
      message: "Product has been deleted successfully",
    });
  } catch (error) {
    return res.json(`${error}`);
  }
});

export default productRouter;
