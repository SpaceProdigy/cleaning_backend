import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST, PORT } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server on PORT:", PORT);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
