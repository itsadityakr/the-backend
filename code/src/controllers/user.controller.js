import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

// Logic
// get user details from frontend -> (not actuall react,html but we will use frontent so lets se user.model.js schema)
// validation for emails,password,etc - email sytanx, password etc
// check if user already exists: username, email like we can check through username and email
// check for images, check for avatar
// upload them to cloudinary, avatar
// create user object -> mongodb no sql so will upload the object, create entry in db
// remove password and refresh token field from response
// check for user creation
// return response

// get user details from frontend -> (not actuall react,html but we will use frontent so lets se user.model.js schema)

/**
 * Controller: registerUser
 *
 * Responsibilities:
 * 1) Read incoming user details from req.body.
 * 2) Validate presence/emptiness of required fields.
 * 3) Ensure no duplicate user (by email OR username).
 * 4) Ensure required files (avatar) exist in req.files.
 * 5) Upload images to Cloudinary; collect URLs.
 * 6) Create the user document in MongoDB.
 * 7) Remove sensitive fields from the response.
 * 8) Send a consistent success response.
 *
 * Assumptions:
 * - Multer is configured with .fields([{ name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }])
 * - User model hashes password via a pre-save hook (recommended).
 * - uploadOnCloudinary(localPath) returns an object with .url (or .secure_url) on success.
 */
const registerUser = asyncHandler(async (req, res) => {
    // 1) Read incoming user details from the client
    // Tip: Coerce to string before .trim() to avoid issues if any field is undefined or non-string.
    const fullname = String(req.body?.fullname ?? "");
    const email = String(req.body?.email ?? "");
    const username = String(req.body?.username ?? "");
    const password = String(req.body?.password ?? "");

    // Optional debug log to confirm payload shape:
    // console.log("Incoming register payload:", { fullname, email, username });

    // 2) Validate required fields (simple non-empty check)
    // Using .some() to check any of them is an empty string after trimming.
    if ([fullname, email, username, password].some((f) => f.trim() === "")) {
        // 400 Bad Request: client sent incomplete data
        throw new apiError(400, "All fields are mandatory");
    }

    // 3) Duplicate user check (by email OR username)
    // IMPORTANT FIX: Add 'await' so we actually wait for the DB result
    const existedUser = await User.findOne({
        $or: [
            { username: username.toLowerCase() },
            { email: email.toLowerCase() },
        ],
    });

    if (existedUser) {
        // 409 Conflict: resource already exists
        throw new apiError(
            409,
            "User with this email or username already exists"
        );
    }

    // 4) File presence check (from Multer's req.files)
    // We expect Multer to have parsed 'avatar' and 'coverImage' fields, each as an array of files (max 1).
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    // Require avatar, but allow coverImage to be optional
    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar file is mandatory");
    }

    // 5) Upload images to Cloudinary
    // We only upload coverImage if a file was provided.
    const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
    const coverImageUpload = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    // Ensure avatar upload succeeded (must have a usable URL)
    if (!avatarUpload || !(avatarUpload.url || avatarUpload.secure_url)) {
        throw new apiError(400, "Avatar upload failed or returned no URL");
    }

    // Normalize URLs — prefer secure_url when available
    const avatarUrl = avatarUpload.secure_url || avatarUpload.url;
    const coverImageUrl = coverImageUpload
        ? coverImageUpload.secure_url || coverImageUpload.url
        : "";

    // 6) Create user in MongoDB
    // NOTE: We lowercase username/email to enforce consistent uniqueness.
    // NOTE: Ensure your User model hashes the password using a pre-save hook; do NOT store plaintext.
    const user = await User.create({
        fullname: fullname.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        password: password, // hashing should occur in User model pre-save hook
        avatar: avatarUrl,
        coverImage: coverImageUrl,
    });

    // 7) Remove sensitive fields from the object we return
    // We re-fetch and .select() to exclude fields; alternatively, you can use toJSON transforms on the schema.
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        // 500 Internal Server Error: something unexpected went wrong after creation
        throw new apiError(500, "Something went wrong while creating user");
    }

    // 8) Send success response
    // Align HTTP status (201 Created) with response payload code (also 201).
    return res
        .status(201)
        .json(
            new apiResponse(201, createdUser, "User registered successfully")
        );
});

export { registerUser };
