# Backend Utilities in Node.js

When you build a backend application, you'll find yourself writing the same patterns of code over and over again, especially for common tasks like connecting to a database, handling errors, and sending responses. To keep your code clean, organized, and easy to maintain, it's a best practice to create "utility" functions.

This guide explains how to create a set of powerful, reusable utilities for a professional Node.js project, focusing on handling asynchronous operations and standardizing API responses.

## What are "Utils"? (Utility Functions)

Think of a "utils" (short for utilities) folder as a **toolbox for your project**. Instead of leaving your tools scattered all over your workshop, you keep them in one organized place. In coding, a `utils` folder holds reusable helper functions that can be used anywhere in your application.

This prevents code duplication and makes your main application logic cleaner and easier to read.

## Handling Asynchronous Operations: Connecting to a Database

Connecting to a database is not an instant process. Your application sends a request to the database server (which could be on another continent\!) and has to wait for a response. This is an **asynchronous operation**.

To handle this, we use `async/await`, which is a modern JavaScript feature that makes asynchronous code look and behave a little more like synchronous (step-by-step) code.

Let's break down the database connection file.

### `db/index.js`

```javascript
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}`
        );
        console.log(
            `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.error("ERROR", error);
        process.exit(1);
    }
};

export default connectDB;
```

  * **`async () => {...}`**: This declares an asynchronous function. It tells JavaScript that this function contains an `await` expression and will return a `Promise`.
  * **`try {...}`**: The `try` block contains the code that might fail. Here, we try to connect to the database using `mongoose.connect()`.
      * **Analogy**: This is your "Plan A." You *try* to do something, hoping it works.
  * **`await mongoose.connect(...)`**: The `await` keyword pauses the function execution *only within this function* until the `mongoose.connect()` operation is complete. It waits for the database to respond before moving to the next line (`console.log`).
  * **`catch (error) {...}`**: If anything inside the `try` block fails, the code inside the `catch` block is executed immediately. This prevents your entire application from crashing.
      * **Analogy**: This is your "Plan B." If Plan A fails, you *catch* the error and handle it gracefully.
  * **`process.exit(1)`**: This is a Node.js command that immediately ends the application. We use it here because if the application cannot connect to the database, it's a fatal error, and it can't do its job.

## The Problem: Repetitive Error Handling

The `try-catch` block is great, but imagine you have 50 different functions that interact with the database (e.g., `getUser`, `createPost`, `updateComment`). You would have to write a `try-catch` block inside every single one of them. This is highly repetitive.

## The Solution: A Reusable `asyncHandler`

To solve this, we can create a special utility function called a "wrapper" or a "handler." This function will take another function as its input and wrap it in error-handling logic. We only have to write the `try-catch` logic once\!

### `utils/asyncHandler.js` (Promise Version)

This version uses Promises directly, which is the underlying technology behind `async/await`.

```javascript
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
    };
};

export { asyncHandler };
```

This might look complex, so let's break it down. `asyncHandler` is a function that accepts your route handler function (`requestHandler`) and returns a *new* function. This new function is what Express will actually run. It executes your original `requestHandler` and automatically `.catch()`es any errors, passing them to Express's error handling middleware via `next(error)`.

### Key Asynchronous and Express Concepts

  * **Promise**: A Promise is an object representing the eventual completion (or failure) of an asynchronous operation.
      * **Analogy**: Think of it like an online order receipt. You don't have the item yet, but you have a "promise" that it will either be **fulfilled** (delivered) or **rejected** (lost in the mail).

      ![alt text](assets/image1.png)
  * **resolve**: `Promise.resolve()` wraps a value or another function in a Promise. It ensures that we are working with a Promise so we can use `.catch()`.
  * **try/catch**: A block for synchronous error handling. The `asyncHandler` (try-catch version) uses this to wrap asynchronous code.
  * **req, res, next**: These are the standard arguments in Express middleware.
      * **`req`**: The request object (incoming data).
      * **`res`**: The response object (what you send back).
      * **`next`**: A function to pass control to the next middleware in the chain. When you call `next(error)`, you are specifically passing it to an error-handling middleware.

### Demystifying Arrow Function Syntax

Let's clarify the different function structures you listed.

1.  `const asyncHandler = () => {}`
      * This defines a function named `asyncHandler` that takes **no arguments**.
2.  `const asyncHandler = (fn) => {}`
      * This defines a function that takes **one argument**, which we've named `fn`.
3.  `const asyncHandler = (fn) => {() => {}}`
      * This is a **higher-order function**. It takes one argument (`fn`) and its body contains the definition of *another* function that takes no arguments. It doesn't return this inner function automatically.
4.  `const asyncHandler = (fn) => () => {}`
      * This is the same as above but uses an **implicit return**. It's a higher-order function that takes `fn` as an argument and **returns** a new function that takes no arguments.
5.  `const asyncHandler = (fn) => async() => {}`
      * This is also a higher-order function. It takes `fn` and returns a new **asynchronous** function. This is the structure used in the common `try-catch` version of `asyncHandler`.

## Standardizing API Responses

When your API sends data back, it should always be in a consistent format. This makes it much easier for the frontend developer to work with your API. We will create two `classes` to standardize our API's error and success responses.

A **class** is a blueprint for creating objects.

### `utils/ApiError.js` - The Custom Error Blueprint

Node.js has a built-in `Error` class, but it's very basic. We want to create our own, more detailed error format that includes an HTTP status code, a list of errors, and more.

```javascript
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
```

#### Breakdown of `ApiError.js`

  * **`class ApiError extends Error`**:
      * This creates a new blueprint called `ApiError`.
      * The `extends Error` part means our `ApiError` blueprint is a specialized version of the built-in `Error` blueprint. It inherits all the basic properties of a normal error (like `message` and `stack`) and lets us add our own.
      * **Analogy**: If `Error` is a blueprint for a "Vehicle," then `ApiError` is a more specific blueprint for a "Car" that adds car-specific properties like `numberOfDoors`.
  * **`constructor(...)`**:
      * The constructor is a special method for creating and initializing an object created from a class. It runs automatically when you use the `new` keyword (e.g., `new ApiError(...)`).
      * The line `constructor(statusCode, message="...", ...)` defines the parameters you need to provide when creating a new `ApiError`. It also sets **default values**. For example, if you don't provide a `message`, it will automatically be "Something went wrong".
  * **The Constructor Body**:
      * **`super(message)`**: This is crucial. It calls the constructor of the parent class (`Error`) to do its initial setup. In this case, it sets the `message` property on the error object, just like a normal Node.js error.
      * **`this.statusCode = statusCode`**: The keyword `this` refers to the specific instance of the object being created. These lines add new properties to our custom error object.
      * **`this.data = null`**: We explicitly set `data` to `null` for errors because an error response typically does not carry a data payload. This ensures a consistent response shape.
      * **`Error.captureStackTrace(this, this.constructor)`**: This is a powerful helper from Node.js. It creates the `.stack` property on our error object. The **stack trace** is a very useful debugging tool that shows the sequence of function calls that led to the error, helping you find the exact line in your code where the problem occurred.

### `utils/ApiResponse.js` - The Custom Success Blueprint

Just as we standardized errors, we should standardize success responses.

```javascript
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
```

#### Breakdown of `ApiResponse.js`

  * **Why use `ApiResponse.js`?**: This class ensures that every successful response sent from your API has the same structure: a status code, the actual data, a message, and a success flag. It's predictable and easy to handle on the frontend.
  * **`this.success = statusCode < 400`**: This is a clever and efficient piece of logic. In the world of HTTP, status codes are standardized:
      * **2xx (e.g., 200 OK, 201 Created)**: The request was successful.
      * **4xx (e.g., 404 Not Found, 401 Unauthorized)**: There was a client-side error (the user did something wrong).
      * **5xx (e.g., 500 Internal Server Error)**: There was a server-side error (your code broke).
  * Since all successful status codes are below 400, this line automatically sets the `success` property to `true` if the status code indicates success, and `false` otherwise.

  Of course. Here is the updated document with relevant code snippets included.

-----

## Core Backend Concepts in Node.js

This document breaks down key concepts used in modern Node.js backend development, from handling asynchronous operations to creating standardized API responses.

-----

### Asynchronous Operations & Middleware

These concepts are fundamental for handling tasks that don't complete instantly, like network requests or database queries.

  * **Promise**: An object that represents the eventual result of an asynchronous operation. Think of it like a receipt for an online order; you don't have the item yet, but you have a "promise" that it will either be **fulfilled** (your package arrives) or **rejected** (the order is canceled).

  * **`try`/`catch`**: A control structure for handling errors in your code. The `try` block contains code that might fail. If an error occurs, the `catch` block is executed immediately, preventing the application from crashing.

    ```javascript
    async function fetchData() {
        try {
            // Attempt to perform an operation that might fail
            const response = await fetch('https://api.example.com/data');
            const data = await response.json();
            console.log("Success:", data);
        } catch (error) {
            // If the 'try' block fails, this code runs
            console.error("An error occurred:", error);
        }
    }
    ```

  * **`resolve`**: The function that is called when a Promise completes successfully. Calling `resolve` moves the Promise from a "pending" state to a "fulfilled" state, delivering its final value.

  * **`req`, `res`, `next`**: These are the three core arguments used in Express.js middleware functions to handle the lifecycle of a server request.

      * **`req` (Request)**: An object containing all information about the incoming request from a client, such as the URL, headers, and any data sent.
      * **`res` (Response)**: An object you use to send a response back to the client. You can send data, status codes, or HTML.
      * **`next`**: A function that tells Express to pass control to the next middleware in the chain. If you pass an error to it, like `next(error)`, it will skip to your designated error-handling middleware.

-----

### Standardizing Errors with a Custom Class

In a professional application, you want all your errors to have a consistent structure. You can achieve this by creating a custom error class that builds upon Node.js's built-in `Error` class.

#### `ApiError.js` Snippet

```javascript
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        // Call the parent constructor with the error message
        super(message);

        // Assigning custom properties
        this.statusCode = statusCode;
        this.data = null; // Errors typically don't have a data payload
        this.message = message;
        this.success = false; // The success flag is always false for an ApiError
        this.errors = errors;

        // Capture the stack trace for debugging
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
```

  * **`extends Error`**: This is a concept called **inheritance**. The `extends` keyword lets you create a new class that inherits all the properties and behaviors of a parent class. In this case, your `ApiError` class gets all the features of the standard `Error` class, and you can add more specific properties like a `statusCode`.

  * **`constructor`**: A special method inside a class that is automatically run when you create a new instance of that class (e.g., `new ApiError(...)`). Its job is to set up the initial properties of the new object.

  * **`constructor(statusCode, message="...", ...)`**: This defines the constructor and the parameters needed to create a new `ApiError` object. The parts like `message="Something went wrong"` set **default values**, which are used if you don't provide a value for that parameter.

  * **The Constructor Body (`super`, `this`)**: This is the code that runs inside the constructor to initialize the object.

      * **`super(message)`**: This is the first thing you must call. It runs the constructor of the parent class (`Error`), which handles the basic setup like setting the error `message`.
      * **`this`**: The `this` keyword refers to the specific object instance being created. The lines that follow (e.g., `this.statusCode = statusCode`) are attaching new, custom properties to this object.
      * **`this.data = null`**: This is a good practice to ensure a consistent response shape. It makes it clear that error responses do not carry a data payload.

  * **`Error.captureStackTrace(...)`**: This is a Node.js function that creates a `.stack` property on your error object. A **stack trace** is a detailed report of which functions were called, in what order, leading up to the error. It's an essential tool for debugging because it helps you find the exact line in your code where the problem occurred.

-----

### Standardizing Success Responses

Just as you standardize errors, you should also standardize success responses for consistency.

#### `ApiResponse.js` Snippet

```javascript
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400; // Automatically determine success based on status code
    }
}
```

  * **Why use `ApiResponse.js`?**: The purpose of an `ApiResponse` class is to ensure that every successful response from your API follows a predictable structure. This makes the API much easier for frontend developers to work with because they always know what format to expect (e.g., a `statusCode`, `data`, `message`, and `success` flag).

  * **What `statusCode < 400` does**: This is a simple and effective way to set a boolean (`true`/`false`) value. It relies on the standard conventions of HTTP status codes, where codes below 400 indicate success or redirection, while codes 400 and above indicate an error. This line automatically sets the `success` property to `true` for successful status codes and `false` for error codes.

  * **Types of HTTP Status Codes**:

      * **2xx (Success)**: The request was successfully received and processed (e.g., `200 OK`, `201 Created`).
      * **4xx (Client Error)**: The request from the client was invalid or could not be fulfilled (e.g., `404 Not Found`, `400 Bad Request`).
      * **5xx (Server Error)**: The server failed to fulfill a valid request due to an internal problem (e.g., `500 Internal Server Error`).
