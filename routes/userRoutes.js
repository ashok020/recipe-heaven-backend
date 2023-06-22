import { Router } from "express";
import { getUser, updateUser } from "../controllers/usersController.js";

import { isAuth } from "../middlewares/isAuth.js";
import { asyncErrorHandler } from "../utils/asyncErrorHandler.js";
const router = Router();
router.use(isAuth);

router.get("/", asyncErrorHandler(getUser));
router.put("/", asyncErrorHandler(updateUser));

export default router;
