import { Router } from "express"

const router = Router();

//CONFIGS
import joi from "./middlewares/joi";
import jwt from "./middlewares/jwt";

// CONTROLLERS
import testController from "./controllers/testController";
import userController from "./controllers/userController";
import authController from "./controllers/authController";
import themeController from "./controllers/themeController";
import subjectController from "./controllers/subjectController";
import vestibularController from "./controllers/vestibularController";
import commentController from "./controllers/commentController";
import answerController from "./controllers/answerController";
import favoriteController from "./controllers/favoriteController";
import questionController from "./controllers/questionController";

// import * as ob from "./controllers/subjectController";
// ob.default

// LIMITAR ROTAS
router.get("/test", testController.test);
router.get("/test2", jwt.userAccess, testController.test);

// router.get("x", ["metodo", "metodo"], "controller") // EX: https://www.youtube.com/watch?v=jHQAfPFrTPo

router.get("/user", userController.get);
router.post("/user", joi("user"), userController.create);

router.get("/theme", themeController.get);
router.post("/theme", themeController.create);
// router.put("/theme", themeController.create);
router.patch("/theme/:id", themeController.update);
router.delete("/theme/:id", themeController.delete);

router.get("/subject", subjectController.get);
router.post("/subject", subjectController.create);
router.patch("/subject/:id", subjectController.update);
router.delete("/subject/:id", subjectController.delete);

router.get("/vestibular", vestibularController.get);
router.post("/vestibular", vestibularController.create);
router.patch("/vestibular/:id", vestibularController.update);
router.delete("/vestibular/:id", vestibularController.delete);

router.get("/comment", commentController.get);
router.post("/comment", commentController.create);
router.patch("/comment/:id", commentController.update);
router.delete("/comment/:id", commentController.delete);

router.get("/answer", answerController.get);
router.post("/answer", answerController.create);
router.patch("/answer/:id", answerController.update);
router.delete("/answer/:id", answerController.delete);

router.get("/favorite", favoriteController.get);
router.post("/favorite", favoriteController.create);
router.delete("/favorite/:id", favoriteController.delete);

router.get("/question", questionController.get);
router.post("/question", questionController.create);
router.patch("/question/:id", questionController.update);
router.delete("/question/:id", questionController.delete);

router.post("/auth", authController.auth);
router.post("/token", authController.token)

export default router;