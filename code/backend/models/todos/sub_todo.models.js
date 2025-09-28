import mongoose from "mongoose";

/* ---------- DEFINE SUBTODO SCHEMA ---------- */
const subTodoSchema = new mongoose.Schema(
  {
    // ------------- content field ----------------
    content: {
      type: String,      // The text of the subTodo (e.g., "Buy milk")
      required: true,    // Must always exist
    },

    // ------------- complete field ----------------
    complete: {
      type: Boolean,     // true/false
      default: false,    // defaults to false if not provided
    },

    // ------------- createBy field ----------------
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",       // Reference to the User who created this subTodo
      required: true,    // Must always be linked to a user
    },

    // ------------- subTodos field ----------------
    subTodos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subTodo",
        // Array of self-references (subTodos inside a subTodo).
        // This is recursion — a subTodo can contain child subTodos.
        // Useful for hierarchical/nested task structures.
      },
    ],
  },

  // ------------- schema options ----------------
  { timestamps: true }
  // Adds createdAt + updatedAt fields automatically
);

/* ---------- CREATE THE MODEL ---------- */

export const SubTodo = mongoose.model("subTodo", subTodoSchema);
// -----------------------------------------------------------------------------
// mongoose.model("subTodo", subTodoSchema)
//   - First argument: "subTodo"
//     -> the model name
//     -> collection will be called "subtodos" (lowercased + pluralized).
//   - Second argument: the schema definition we just made.
// export const SubTodo
//   - makes this model available to other files.
// -----------------------------------------------------------------------------
