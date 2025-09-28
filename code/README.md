# **User and Video Modelling using Hooks and JWT**

When building a complex application like a video-sharing platform, the foundation is the **data model**. This is the blueprint that defines what kind of information you need to store and how different pieces of information relate to each other. This guide will walk you through the entire process of creating robust and secure data models for users and videos using Mongoose.

-----

## **Part 1: Data Modeling - The Blueprint for Your Application**

First, we need to define the structure of our data. We'll create two main blueprints, or **schemas**: one for `User` and one for `Video`.

### **The User Model**

The `userSchema` defines all the properties a user can have in our application.

```javascript
// user.model.js
import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, // Removes whitespace from both ends of a string
            index: true, // Creates a database index for faster searching
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String, // URL to the image
            required: true,
        },
        coverImage: {
            type: String, // URL to the image
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video", // Reference to the Video model
            },
        ],
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);
```

  * **Validation Rules**: Fields like `username` and `email` use several important rules:
      * **`required: true`**: This field must have a value.
      * **`unique: true`**: No two users can have the same value for this field.
      * **`lowercase: true`**: Automatically converts input to lowercase.
      * **`trim: true`**: Removes any accidental spaces from the beginning or end of the input.
      * **`index: true`**: This is a performance optimization. Like an index in a book, it makes searching the database by this field much faster.
  * **`watchHistory`**: This is an **array** that holds a list of video IDs. The `ref: "Video"` is crucial—it creates a direct link between a user and the videos they've watched, telling our database that each ID in this array corresponds to a document in the `Video` collection.
  * **`timestamps: true`**: This option automatically adds `createdAt` and `updatedAt` fields to our documents, which is useful for tracking when data is created or modified.

### **The Video Model**

The `videoSchema` defines the structure for every video uploaded to the platform.

```javascript
// video.model.js
import mongoose, { Schema } from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        videoFile: {
            type: String, // URL from a cloud service like Cloudinary
            required: true,
        },
        thumbnail: {
            type: String, // URL from a cloud service
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User", // A reference to the user who uploaded the video
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        duration: {
            type: Number, // Video duration in seconds
        },
        views: {
            type: Number,
            default: 0, // Videos start with 0 views
        },
        isPublished: {
            type: Boolean,
            default: true, // Default to published
        },
    },
    { timestamps: true }
);
```

  * **`videoFile` & `thumbnail`**: These fields store URLs. It's bad practice to store large files like videos or images directly in your database. Instead, we upload them to a cloud service (like Cloudinary) and save the access URL here.
  * **`owner`**: This is another critical **reference**. It links each video back to the user who uploaded it via the `ref: "User"` property.
  * **`views`**: This field uses `default: 0` to ensure that every new video automatically starts with a view count of zero.

-----

## **Part 2: Security and Authentication**

With our blueprints ready, we need to add security. We'll install two libraries: **`bcrypt`** for securely hashing passwords and **`jsonwebtoken`** for managing user sessions.

```bash
npm install bcrypt jsonwebtoken
```

### **Hashing Passwords with Mongoose Hooks**

We must **never** store passwords in plain text. Mongoose **hooks** (or middleware) are functions that run automatically at specific points. We will use a `pre('save')` hook to encrypt passwords *before* they are saved.

**The Code: A "Pre-Save" Hook**
This code is added to your `user.model.js` file.

```javascript
userSchema.pre("save", async function (next) {
    // Only run this function if the password was actually modified
    if (!this.isModified("password")) return next();

    // Hash the password with a cost factor of 10
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
```

This hook intercepts the save process. If the password has been changed, it uses `bcrypt` to hash it and then continues the save operation. The `10` represents the "salt rounds," a measure of how strong the encryption is.

### **Creating Custom Methods for Authentication**

Mongoose lets us add our own helper functions, called **methods**, to our schemas.

**1. Checking the Password**
This method securely compares a login password attempt with the stored hash.

```javascript
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};
```

**2. Generating JSON Web Tokens (JWT)**
**JWTs** are like temporary digital ID cards. After a user logs in, the server gives them a signed token. The user includes this token in future requests to prove their identity.

```javascript
// Method to generate a short-lived access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// Method to generate a long-lived refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};
```

  * **Access Token**: Used for day-to-day API requests. It's short-lived (e.g., expires in 1 day) for security.
  * **Refresh Token**: Used only to get a new access token when the old one expires. It is long-lived (e.g., 10 days) and is stored in the database.

### **Environment Variables for Security**

Your secret keys must be kept out of your code in a `.env` file.

```
ACCESS_TOKEN_SECRET=your-super-secret-and-long-access-string
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your-even-more-secret-and-longer-refresh-string
REFRESH_TOKEN_EXPIRY=10d
```

-----

## **Part 3: Handling Complex Queries with Aggregation**

For complex features like a recommendation engine or detailed watch history analysis, simple queries aren't enough. We need **MongoDB Aggregation Pipelines**.

**Analogy**: An aggregation pipeline is like a factory assembly line for your data. Data goes in one end and passes through a series of stages (filtering, sorting, grouping) until it comes out the other end perfectly formatted for your needs.

To make this easier, especially with pagination (showing data page by page), we use the `mongoose-aggregate-paginate-v2` plugin.

```javascript
// Add this to your video.model.js
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// ... after your schema definition ...
videoSchema.plugin(mongooseAggregatePaginate);
```

This simple line adds powerful pagination capabilities to your complex aggregation queries.

-----

## **Part 4: The Final Code**

Here is the final, complete code for both models.

### **`user.model.js`**

```javascript
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String, // Cloudinary URL
            required: true,
        },
        coverImage: {
            type: String, // Cloudinary URL
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            },
        ],
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Mongoose "pre" hook to hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Custom method to check if the password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Custom method to generate a short-lived access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Custom method to generate a long-lived refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
```

### **`video.model.js`**

```javascript
import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, // Cloudinary URL
            required: true,
        },
        thumbnail: {
            type: String, // Cloudinary URL
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

// Apply the plugin for aggregation and pagination
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
```
