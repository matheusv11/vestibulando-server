import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3030;
import routes from "./router";
import handleRejection from "./utils/handleRejection";
import handleErrors from "./utils/handleErrors";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(handleRejection);

app.use(routes);

// app.use(handleErrors);

app.listen(port, ()=> console.log(`Backend Running in ${port}`));