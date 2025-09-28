import mongoose from "mongoose";
// -----------------------------------------------------------------------------
// import
//   - ES Module keyword for loading external code.
// mongoose
//   - ODM library (Object Data Modeling) for MongoDB in Node.js.
// "mongoose" (string)
//   - Name of the installed npm package. Node.js looks in node_modules folder.
// -----------------------------------------------------------------------------


/* ---------- DEFINE THE SCHEMA ---------- */
const todoSchema = new mongoose.Schema(
  {
    // ------------- content field ----------------
    content: {
      type: String,      // this field stores plain text (like "Buy milk")
      required: true,    // must exist — a todo without content is invalid
    },

    // ------------- complete field ----------------
    complete: {
      type: Boolean,     // true/false value
      default: false,    // if not provided, Mongoose will set it to false
    },

    // ------------- createdBy field ----------------
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      // ObjectId is the special MongoDB type for document IDs.
      // Each MongoDB document has a unique "_id" field of type ObjectId.
      // This lets us reference another document in another collection.

      ref: "User",
      // "ref" tells Mongoose which model this ObjectId points to.
      // Here it points to the "User" model (from user.model.js).
      // -> This allows population, e.g. Todo.find().populate("createBy")

      required: true, // every Todo must be linked to a user who created it
    },

    // ------------- subTodos field ----------------
    subTodos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subTodo",
        // Each item in this array references a document
        // from the "subTodo" model (another schema you’ll define).
      },
    ],
    // Notes:
    // - subTodos is an *array* of ObjectIds.
    // - This creates a one-to-many relationship:
    //   One Todo can have many subTodos.
    // - Example: Todo "Buy groceries" may have subTodos ["Buy milk", "Buy eggs"].
  },

  // ------------- schema options ----------------
  { timestamps: true }
  // timestamps: true
  //   - Adds createdAt and updatedAt date fields automatically.
  //   - createdAt = when the document was first saved
  //   - updatedAt = auto-updated whenever document changes
);


/* ---------- CREATE THE MODEL ---------- */
export const Todo = mongoose.model("Todo", todoSchema);
// -----------------------------------------------------------------------------
// mongoose.model("Todo", todoSchema)
//   - Creates a Model class from the schema.
//   - "Todo" (first argument) is the model name.
//   - MongoDB collection name will be automatically lowercased + pluralized:
//       "Todo" -> "todos"
//   - Unless overridden by specifying a 3rd argument.
// export const Todo
//   - makes the Todo model available to other files via import.
// -----------------------------------------------------------------------------
