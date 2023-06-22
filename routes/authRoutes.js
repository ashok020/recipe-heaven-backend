import { Router } from "express";
const router = Router();

import { login, register } from "../controllers/authController.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";

router.post("/login", asyncErrorHandler(login));
router.post("/register", asyncErrorHandler(register));

export default router;
