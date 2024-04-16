// const mongoose = require("mongoose");

// const categorySchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     slug: {
//       type: String,
//       required: true,
//     },
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//     },
//   },
//   {
//     versionKey: false,
//     timestamps: true,
//   }
// );

// const CategoryModel = mongoose.model("category", categorySchema);

// module.exports = {
//   CategoryModel,
// };

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const CategoryModel = mongoose.model("category", categorySchema);

module.exports = {
  CategoryModel,
};
