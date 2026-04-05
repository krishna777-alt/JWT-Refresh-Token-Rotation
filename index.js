import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

const port = process.env.PORT || 5000;

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

mongoose
  .connect(DB, {})
  .then(() => console.log("DataBase Connected Successfully"))
  .catch((error) =>
    console.log(`Failed to Connect DataBase,ERROR:${error.message}`),
  );

app.listen(port, () => {
  console.log(`Server is running on Port:${port}`);
});
