import { Router } from "express"

const router = Router();

//CONFIGS
import joi from "./middlewares/joi";
import jwt from "./middlewares/jwt";

// CONTROLLERS
import testController from "./controllers/testController";
import userController from "./controllers/userController";
import authController from "./controllers/authController";
import disciplineController from "./controllers/disciplineController";
import subjectController from "./controllers/subjectController";
import vestibularController from "./controllers/vestibularController";
import commentController from "./controllers/commentController";
import answerController from "./controllers/answerController";
import favoriteController from "./controllers/favoriteController";
import questionController from "./controllers/questionController";
import ownVestibularController from "./controllers/ownVestibularController";

// import * as ob from "./controllers/subjectController";
// ob.default

// LIMITAR ROTAS

router.get("/user", userController.get);
router.post("/user", joi("user"), userController.create);

router.get("/discipline", disciplineController.get);
router.post("/discipline", joi("discipline"), disciplineController.create);
router.patch("/discipline/:id", joi("discipline"), disciplineController.update);
router.delete("/discipline/:id", disciplineController.delete);

router.get("/subject", subjectController.get);
router.post("/subject", joi("subject"), subjectController.create);
router.patch("/subject/:id", joi("subject"), subjectController.update);
router.delete("/subject/:id", subjectController.delete);

router.get("/vestibular", vestibularController.get);
router.post("/vestibular", joi("vestibular"), vestibularController.create);
router.patch("/vestibular/:id", joi("vestibular"), vestibularController.update);
router.delete("/vestibular/:id", vestibularController.delete);

router.get("/comment", commentController.get);
router.post("/comment", joi("comment"), jwt.userAccess, commentController.create);
router.patch("/comment/:id", joi("updateComment"), jwt.userAccess, commentController.update);
router.delete("/comment/:id", jwt.userAccess, commentController.delete);

router.get("/answer", answerController.get);
router.post("/answer", joi("answer"), jwt.userAccess, answerController.create);
router.patch("/answer/:id", joi("answer"), jwt.userAccess, answerController.update);
router.delete("/answer/:id", jwt.userAccess, answerController.delete);

router.get("/favorite", favoriteController.get);
router.post("/favorite", joi("favorite"), jwt.userAccess, favoriteController.create);
router.delete("/favorite/:id", jwt.userAccess, favoriteController.delete);

router.get("/question", jwt.userOptionalAccess, questionController.get);
router.post("/question", joi("question"), questionController.create);
router.patch("/question/:id", joi("question"), questionController.update);
router.delete("/question/:id", questionController.delete);

router.get("/own-vestibular", ownVestibularController.get);
router.post("/own-vestibular", joi("ownVestibular"), jwt.userAccess, ownVestibularController.create);
router.patch("/own-vestibular/:id", joi("ownVestibular"), jwt.userAccess, ownVestibularController.update);
router.delete("/own-vestibular/:id", jwt.userAccess, ownVestibularController.delete);

router.post("/auth", authController.auth);
router.post("/token", authController.token)

router.get("/test", testController.test);
router.get("/test2", jwt.userAccess, testController.test);
// router.get("x", ["metodo", "metodo"], "controller") // EX: https://www.youtube.com/watch?v=jHQAfPFrTPo

export default router;