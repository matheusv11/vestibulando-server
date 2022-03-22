import { Router } from "express"

const router = Router();

//CONFIGS
import joi from "./middlewares/joi";
// CONTROLLERS
import testController from "./controllers/testController";
import userController from "./controllers/userController";

// LIMITAR ROTAS
router.get("/test", testController.test);

router.get("/user", userController.get);
router.post("/user", joi("user"), userController.create);

export default router;