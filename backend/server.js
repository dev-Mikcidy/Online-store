import {app} from "./src/express.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";


dotenv.config();
connectDB();


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
