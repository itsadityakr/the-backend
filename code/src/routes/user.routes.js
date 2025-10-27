import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

/**
 * POST /register
 *
 * Uses Multer to parse a multipart/form-data request with:
 * - avatar: required (max 1 file) — your controller enforces the requirement
 * - coverImage: optional (max 1 file)
 *
 * After Multer parses the request, files are available on:
 *   req.files.avatar[0] and req.files.coverImage[0] (if provided)
 * Body fields (fullname, email, username, password) are in req.body
 */
router
  .route("/register")
  .post(
    upload.fields([
      { name: "avatar", maxCount: 1 },      // MUST be a number
      { name: "coverImage", maxCount: 1 },  // not "1"
    ]),
    registerUser
  );

export default router;
