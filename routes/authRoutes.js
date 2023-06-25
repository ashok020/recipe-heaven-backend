import { Router } from "express";
const router = Router();

import { login, register, checkAuth } from "../controllers/authController.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
import { isAuth } from "../middlewares/isAuth.js";

router.get("/auth-check", isAuth, asyncErrorHandler(checkAuth));
router.post("/login", asyncErrorHandler(login));
router.post("/register", asyncErrorHandler(register));
export default router;
