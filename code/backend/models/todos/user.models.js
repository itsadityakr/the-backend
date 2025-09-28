import mongoose from "mongoose";
// -----------------------------------------------------------------------------
// import
//   - ES Module keyword used to bring in exported bindings from another file/package.
// mongoose
//   - the variable name we choose to refer to the package we're importing.
//   - "mongoose" is a Node.js package (installed with `npm i mongoose`) that provides
//     an "Object Data Modeling" (ODM) layer on top of MongoDB.
// "mongoose" (string)
//   - the package specifier/name that Node resolves to find the installed package.
// -----------------------------------------------------------------------------

/* ---------- SCHEMA DEFINITION ---------- */
/* A Schema describes the shape of documents in a MongoDB collection:
   what fields exist, their types, and validation/transform options. */
const userSchema = new mongoose.Schema(
    {
        // -------- username field ----------
        username: {
            // "username" is the *field name* in the MongoDB document (key)
            type: String, // JavaScript constructor used to cast this field (String)
            required: true, // validator: field must exist (not undefined/null)
            unique: true, // creates a unique index in MongoDB (see notes below)
            trim: true, // removes whitespace from both ends before saving
            // NOTE: you can also add minlength, maxlength, match (regex), etc.
        },

        // -------- email field ----------
        email: {
            type: String, // stores JS string values
            required: true, // email must be present
            unique: true, // attempt to enforce uniqueness at DB index level
            trim: true, // remove surrounding whitespace
            lowercase: true, // convert to lowercase before saving (useful for emails)
            // You may also use match: /.../ to validate email format or a custom validator.
        },

        // -------- password field ----------
        password: {
            type: String, // password stored as a string (but see notes)
            required: [true, "password is required"], // same as required: true but with custom error message
            // NOTE: DO NOT store raw/plain-text passwords in real apps.
            //       Hash the password (bcrypt/scrypt/argon2) before saving.
            //       Example pre-save hook provided at the bottom of this file.
        },
    },

    // ---------- schema options ----------
    { timestamps: true }
    // timestamps: true
    //   - When true, Mongoose automatically adds and maintains two Date fields:
    //       createdAt  -> set when the document is first created
    //       updatedAt  -> updated each time the document is modified via Mongoose
    //   - Handy so you don't need to manually set those fields.
);

/* ---------- CREATE & EXPORT MODEL ---------- */
/* A Model is a compiled class from a schema. It provides methods to create, read,
   update and delete documents of that schema type. */
export const User = mongoose.model("User", userSchema);

// -----------------------------------------------------------------------------
// mongoose.model("User", userSchema)
//   - "User" is the model name (a string). Mongoose uses this to create or look up the collection.
//   - By default Mongoose converts this model name to a collection name by lowercasing and pluralizing.
//     e.g. "User" -> "users", "Person" -> "people".
//   - You can override the collection name by passing a third argument, e.g.
//       mongoose.model("User", userSchema, "my_users_collection")
// export const User
//   - ES Module export of the "User" binding. Other modules can import { User } from "./user.model.js".
// -----------------------------------------------------------------------------

/* ------------------ Important Practical Notes (short) ------------------
1) required:
   - ensures the field is present (not undefined/null) at validation time.
   - if you also want to disallow empty strings, add minlength: 1 or a custom validator.

2) unique:
   - NOT a validation action by itself. It sets a unique index in MongoDB.
   - If two documents violate uniqueness, MongoDB throws a duplicate-key error on insert/update.
   - Always ensure indexes exist in your DB (use mongoose.syncIndexes() or create indexes separately).

3) Security (PASSWORDS):
   - Never store plain text passwords. Use bcrypt/argon2/scrypt to hash before saving.
   - See example "pre save" hook below.

4) Schema vs Model:
   - Schema: describes shape and behavior of documents.
   - Model: a class you use to interact with a collection (e.g., User.find(), new User()). */
