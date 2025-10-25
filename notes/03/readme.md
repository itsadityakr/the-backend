# Building Your First Express.js Server

This guide explains how to set up a basic web server using **Express.js**, a popular and minimalist web framework for Node.js. We'll cover creating the server, understanding its core components, adding routes, and managing configuration with environment variables.

-----

## 1\. Installation and Basic Setup

First, you need to add Express to your project. Run the following command in your terminal:

```bash
npm install express
```

Now, you can create a simple server. Save the following code in your `index.js` file:

```javascript
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

-----

## 2\. Understanding the Code

Let's break down what each part of this code does.

### **`const express = require("express");`**

  * **`require()`** is Node.js's built-in function to import modules. When you write `require("express")`, you are loading the entire Express library that you installed with `npm`. The result is assigned to the `express` constant.

### **`const app = express();`**

  * This line creates an instance of the Express application. You can think of `express` as a blueprint, and `app` as the actual house you build from that blueprint. The `app` object has methods for routing HTTP requests, configuring middleware, and starting the server.

### **`const port = 3000;`**

  * A **port** is a numbered communication endpoint on a computer. If your server's IP address is like a building's street address, the port is like a specific apartment number. Port `3000` is commonly used for local development.

### **`app.get("/", (req, res) => { ... });`**

This line defines a route. Let's break it down word by word:

  * **`app`**: This is your Express application instance.
  * **`.get`**: This is an HTTP method that corresponds to a **GET** request, which is used to retrieve data. When a user types a URL into their browser, they are making a GET request.
  * **`/`**: This is the **path** or **route**. The single `/` refers to the root URL of your site (e.g., `http://localhost:3000`).
  * **`(req, res) => { ... }`**: This is a **callback function** that runs whenever a GET request is made to the `/` path. It receives two important objects:
      * **`req`** (Request): An object containing information about the incoming HTTP request, such as headers, query parameters, and more.
      * **`res`** (Response): An object used to send a response back to the client who made the request.
  * **`res.send("Hello World!")`**: This method on the response object sends a response back to the browser. In this case, it sends the simple text "Hello World\!".

### **`app.listen(port, () => { ... });`**

  * This function starts up the server and makes it "listen" for incoming connections on the specified `port`. The second argument is a callback function that runs once the server has successfully started, which we use here to log a confirmation message to the console.

-----

## 3\. Adding More Routes

You can define multiple routes for different URLs.

```javascript
// Add this to your index.js

app.get("/twitter", (req, res) => {
  res.send("Hello Twitter!"); // Responds at http://localhost:3000/twitter
});

app.get("/html", (req, res) => {
  res.send("<h1>HTML Response</h1>"); // Responds at http://localhost:3000/html
});
```

### **Why do we need to restart the server?**

When you run `node index.js`, Node.js reads your file once and loads it into memory. It does not automatically watch for changes you make to the file. If you add a new route (like `/twitter`), the running process has no knowledge of it. You must **stop** the server (with `Ctrl + C`) and **restart** it to load the new code.

> **Pro Tip:** Developers often use a tool called **nodemon** during development, which automatically restarts the server whenever it detects a file change.

-----

## 4\. Using Environment Variables for the Port

Hardcoding the port number (`const port = 3000;`) can cause problems. When you deploy your application to a hosting service, the service will often assign a port for you. If your code is hardcoded to use port `3000`, it will fail.

The solution is to use **environment variables**.

1.  **Install the `dotenv` package:**
    This utility loads variables from a `.env` file into `process.env`.

    ```bash
    npm install dotenv
    ```

2.  **Create a `.env` file:**
    In the root of your project, create a new file named `.env` and add your variable:

    ```
    # .env file
    PORT=2500
    ```

    **Important:** You should always add your `.env` file to `.gitignore` to avoid committing secret keys and credentials to a public repository.

3.  **Update your `index.js` file:**
    Load and use the environment variables at the very top of your application.

    ```javascript
    require('dotenv').config(); // Loads variables from .env file

    const express = require("express");
    const app = express();

    const port = process.env.PORT || 3000;

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    // Your other routes go here...

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
    ```

    Now, your application will use the port defined in your `.env` file (2500). If that variable isn't found, it will fall back to using 3000. This makes your application much more flexible and portable.

### **How `process.env.PORT` Works**

  * **`process`** is a global object in Node.js that provides information about, and control over, the current Node.js process.
  * **`.env`** is a property on the `process` object that contains all the environment variables that were available when the process was started.
  * When you run `require('dotenv').config()`, the `dotenv` library reads your `.env` file and attaches all the variables it finds to the `process.env` object.
  * So, **`process.env.PORT`** is how you access the value of the `PORT` variable that you defined in your `.env` file. If you had another variable like `DATABASE_URL=...` in your `.env` file, you would access it using `process.env.DATABASE_URL`.

  ---
