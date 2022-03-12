import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3030;
import routes from "./router";

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, ()=> console.log(`Backend Running in ${port}`));