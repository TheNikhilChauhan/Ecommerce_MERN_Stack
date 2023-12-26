import app from "./app.js";
import dbConnect from "./db/dbConnect.js";

const PORT = process.env.PORT;

dbConnect();
app.listen(PORT, () => {
  console.log(`Server listening to port: ${PORT}`);
});
