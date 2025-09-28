# Data Modeling in Mongoose

When you build an application, the most important part is how you structure your data. **Data modeling** is the process of planning this structure. It's like creating a blueprint for a house before you start building. A good blueprint ensures that everything fits together, is easy to find, and can be expanded later.

In MongoDB, we use **Mongoose** to create these blueprints. A Mongoose **Schema** is the blueprint that defines the structure of our data, and a Mongoose **Model** is the tool we use to actually create, read, and manage the data based on that blueprint.

Let's explore these concepts using your e-commerce application schemas.

-----

## **Part 1: The Basic Building Blocks (Users & Categories)**

We'll start with the simplest models to understand the core concepts.

### **The User Model**

This model defines what a user's data should look like in your database.

```javascript
// user.models.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
```

#### **Dissecting a Field**

Each key in the schema (like `username`) is a field with a set of rules:

  * `type: String`: This specifies the data type. Other common types are `Number`, `Boolean`, `Date`, etc.
  * `required: true`: This field **must** have a value. You cannot create a user without a username.
  * `unique: true`: The value for this field must be unique across all user documents. No two users can have the same username or email.
  * `lowercase: true`: Mongoose will automatically convert the value of this field to lowercase before saving it. This is great for standardizing data like usernames and emails.

#### **The Timestamps Option**

  * `{ timestamps: true }`: This is a powerful option you pass to the schema. When enabled, Mongoose automatically adds two fields to your document: `createdAt` and `updatedAt`. This is incredibly useful for tracking when data was created or last modified.

### **The Category Model**

This is another simple model that shows the basic structure.

```javascript
// category.model.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
```

Here, a category only needs a `name`. Note that the model is exported as `Category`, but in the `product.model.js` `ref` property, it is referenced as `"Category"`. It is best practice to name the exported model with a capital letter.

-----

## **Part 2: Creating Relationships Between Models (The Product Model)**

This is where data modeling gets powerful. Your data doesn't exist in isolation; products belong to categories, and orders belong to users. We create these connections using **references**.

```javascript
// product.models.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { required: true, type: String },
        description: { required: true, type: String },
        productImage: { type: String },
        price: { type: Number, default: 0 },
        stock: { type: Number, default: 0 },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
```

#### **How References Work**

Look at the `category` and `owner` fields:

  * `type: mongoose.Schema.Types.ObjectId`: This special data type tells Mongoose that we are going to store a unique ID of another document from our database.
  * `ref: "Category"`: This is the most important part. It tells Mongoose, "The ID stored in this field belongs to a document in the **`Category`** collection." This creates a direct link between a product and its category.

**Analogy**: Think of it like a contact list on your phone. When you add a friend to a calendar event, you don't write down all their details (name, address, phone number) in the event itself. You just **reference** their contact card. The `ObjectId` is like the unique link to that contact card.

#### **A Note on Storing Files**

Your comment on `productImage` is excellent and highlights a crucial best practice.

  * **Don't store large files (images, videos, PDFs) directly in your database.** It makes the database extremely large, slow, and expensive to manage.
  * **The correct approach**: Upload the file to a dedicated file storage service (like Cloudinary or AWS S3). After the upload is complete, you get a URL for that file. You then save that **URL** (which is just a `String`) in your database.

-----

## **Part 3: Advanced Modeling - Arrays & Sub-documents (The Order Model)**

The `Order` model demonstrates how to handle more complex data structures, like a list of items within a single order.

```javascript
// order.model.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema(
    {
        orderPrice: { type: Number, required: true },
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        orderItems: [orderItemSchema], // Array of sub-documents
        address: { type: String, required: true },
        status: {
            type: String,
            enum: ["PENDING", "CANCELLED", "DELIVERED"],
            default: "PENDING",
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
```

#### **Arrays of Sub-documents**

  * **`orderItemSchema`**: First, a separate schema is defined for a single item within an order. It contains a reference to a `Product` and the `quantity`. This is a **sub-document schema**.
  * **`orderItems: [orderItemSchema]`**: Inside the main `orderSchema`, this line defines `orderItems` as an **array**, where every element in the array must follow the structure of `orderItemSchema`. This allows you to embed a list of products directly within an order document.

#### **Restricting Values with `enum`**

  * `enum: ["PENDING", "CANCELLED", "DELIVERED"]`: The `enum` validator is an array of allowed values. This ensures that the `status` field can *only* be one of these three strings. It's a great way to prevent typos and ensure data integrity.
  * `default: "PENDING"`: If no status is provided when an order is created, it will automatically be set to `"PENDING"`.
