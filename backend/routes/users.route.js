import express from "express";
import { getUser, updateUser } from "../controllers/users.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:id", protectRoute, getUser);
router.put("/:id", protectRoute, updateUser);

export default router;
