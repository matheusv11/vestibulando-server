import { Router } from "express"

const router = Router();

// CONTROLLERS

import testController from "./controllers/testController";

router.get("/test", testController.test);

export default router;