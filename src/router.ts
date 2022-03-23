import { Router } from "express"

const router = Router();

//CONFIGS
import joi from "./middlewares/joi";
import jwt from "./middlewares/jwt";

// CONTROLLERS
import testController from "./controllers/testController";
import userController from "./controllers/userController";
import authController from "./controllers/authController";

// LIMITAR ROTAS
router.get("/test", testController.test);
router.get("/test2", jwt.userAccess, testController.test);

// router.get("x", ["metodo", "metodo"], "controller") // EX: https://www.youtube.com/watch?v=jHQAfPFrTPo

router.get("/user", userController.get);
router.post("/user", joi("user"), userController.create);

router.post("/auth", authController.auth);
router.post("/token", authController.token)

export default router;