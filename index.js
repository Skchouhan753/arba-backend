require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const app = express();
const cors = require("cors");
const { connection } = require("./config/db");
const { auth } = require("./middleware/auth.middleware");
const { categoryRouter } = require("./routes/categoryRoutes");
const { userRouter } = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());


app.get("/",auth,(req,res)=>{
  res.status(200).json({msg:"wlcome"})
})

app.use("/user",userRouter)
app.use('/api', categoryRouter)


app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`server is running at port ${PORT}`);
    console.log(`connected to mongoDB`);
  } catch (err) {
    console.log(err);
  }
});
