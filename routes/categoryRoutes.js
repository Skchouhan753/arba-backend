const express = require('express');
const { CategoryModel } = require('../model/categoryModel');
const categoryRouter = express.Router();

categoryRouter.post('/categories', async (req, res) => {
  try {
    const { name, slug, image, owner } = req.body;
    
    // Create new category
    const category = new CategoryModel({
      name,
      slug,
      image,
      owner,
    });

    // Save the new category
    await category.save();

    res.status(201).send("Category created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating category");
  }
});



categoryRouter.get('/categories', async (req, res) => {
  try {
    // Fetch all categories
    const categories = await CategoryModel.find();
    
    res.send(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting categories");
  }
});

categoryRouter.get('/api/categories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find the category by ID
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.send(category);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting category");
  }
});


categoryRouter.patch('/categories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, slug, image } = req.body;

    // Find the category by ID
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).send("Category not found");
    }

    // Update category fields
    if (name) {
      category.name = name;
    }
    if (slug) {
      category.slug = slug;
    }
    if (image) {
      category.image = image;
    }

    // Save the updated category
    await category.save();

    res.send("Category updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating category");
  }
});



categoryRouter.delete('/categories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Find the category by ID and delete
    const category = await CategoryModel.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.send("Category deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting category");
  }
});




module.exports = {
  categoryRouter
};
