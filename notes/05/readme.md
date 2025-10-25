# Creating Your First Backend API

This document will walk you through every step of creating a simple backend server using Node.js and the Express framework. The goal is to create a server that can provide data (in this case, a list of users) to any application that requests it, such as a future frontend website.

---

## 1\. Project Structure: Keeping Things Organized

First, we create a clear folder structure.

```
MyProject/
├── backend/
└── frontend/
```

-   **`MyProject/`**: This is the main folder that will contain your entire application.
-   **`backend/`**: This folder will hold all the code for our server. This is the "brain" of our application that handles logic and data.
-   **`frontend/`**: This folder is where you would eventually build your user interface (the website that users see and interact with), perhaps using HTML, CSS, and React.

This separation is crucial because it keeps your server-side code completely separate from your client-side code, making the project much easier to manage.

---

## 2\. Setting Up the Backend

Navigate into your `backend` folder from your terminal and run the following command:

```bash
npm init
```

-   **`npm`** stands for **Node Package Manager**. It is a tool that helps you manage external libraries (packages) in your project.
-   **`init`** stands for initialize. This command starts a step-by-step process to create a `package.json` file.

The `package.json` file is like an ID card for your project. It contains important metadata such as the project's name, version, and, most importantly, a list of its dependencies (the external packages it needs to run).

### Modifying `package.json`

1.  **Entry Point**: During the `npm init` process, it will ask for an "entry point." The default is `index.js`. You should change this to `server.js`. If you've already completed the process, you can open `package.json` and manually change the line:

    -   **From**: `"main": "index.js",`
    -   **To**: `"main": "server.js",`
    -   **Reason**: While `index.js` is a common default, using `server.js` as the name for the main file that starts your server is a very common and descriptive convention in backend development.

2.  **Module Type**: To use the modern `import ... from ...` syntax, you must tell Node.js that your project uses **ES Modules**. Add this line to your `package.json` file:

    -   `"type": "module",`
    -   **Reason**: By default, Node.js uses an older system called **CommonJS** (`require()`). If you try to use `import` without setting the type to `"module"`, you will get a `SyntaxError: Cannot use import statement outside a module`.

3.  **Scripts**: The `"scripts"` section in `package.json` allows you to create shortcuts for terminal commands. Update it to look like this:

    -   `"scripts": { "start": "node server.js" }`
    -   **Reason**: This creates a custom command `npm start`. When you run it, npm will execute `node server.js` for you. This is a standard convention and makes it easy for anyone to run your project without needing to know the exact name of the main file.

---

## 3\. Writing the Server Code (`server.js`)

Now, create the `server.js` file inside the `backend` folder and add the following code. Let's break it down line by line.

```javascript
import express from "express";

const app = express();

app.get("/users", (req, res) => {
    const users = [
        { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com" },
        { id: 2, name: "Bob Smith", email: "bob.smith@example.com" },
        { id: 3, name: "Charlie Davis", email: "charlie.davis@example.com" },
        { id: 4, name: "Diana Prince", email: "diana.prince@example.com" },
        { id: 5, name: "Ethan Brown", email: "ethan.brown@example.com" },
    ];
    res.send(users);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
```

### Code Breakdown:

-   **`import express from "express";`**

    -   This line imports the **Express** library, which is a framework designed to make building web servers and APIs much simpler. You will first need to install it by running `npm install express` in your backend folder.

-   **`const app = express();`**

    -   This line creates an instance of the Express application. The `app` variable is now our main object that we will use to configure our server, define routes, and more.

-   **`app.get("/users", (req, res) => { ... });`**

    -   This is the core of our API. It defines a **route**.
    -   **`app.get`**: This specifies that we are creating a route that responds to **HTTP GET requests**. GET requests are used to retrieve data from a server.
    -   **`"/users"`**: This is the **endpoint** or **path** of the route. When someone wants to get the list of users, they will need to access our server at this specific path (e.g., `http://localhost:3000/users`). The leading slash `/` is essential; it signifies a path from the root of the server's domain.
    -   **`(req, res) => { ... }`**: This is a **callback function** that executes whenever a request is made to the `/users` endpoint. It takes two primary arguments:
        -   `req` (Request): An object containing all information about the incoming request from the client.
        -   `res` (Response): An object we use to build and send a response back to the client.

-   **`const users = [ ... ];`**

    -   Inside the route handler, we define a constant named `users`. It is an **array** of JavaScript **objects**. For now, this array is acting as our simple, hardcoded database.

-   **`res.send(users);`**

    -   This is the line that sends the data back to the client. The `res.send()` method sends a response. Because we are sending it a JavaScript array, Express is smart enough to automatically convert it into the **JSON format** and set the correct `Content-Type` header (`application/json`) so the client's browser knows how to interpret the data.

-   **`const port = process.env.PORT || 3000;`**

    -   A **port** is a specific "door" on a computer for network communication. We declare a variable `port`. We first try to get the port number from the **environment variables** (`process.env.PORT`). This is important for deployment, as hosting services will assign a port automatically. If it's not available (like when we are running it on our own machine), it uses `3000` as a default.

-   **`app.listen(port, () => { ... });`**

    -   This function starts the server and makes it "listen" for incoming connections on the specified port.
    -   The callback function `() => { console.log(...) }` is optional but highly recommended. It runs once the server is successfully started, printing a confirmation message to your terminal.

---

## 4\. Running Your Backend Server

1.  Make sure you are in the `backend` directory in your terminal.
2.  Run the command:
    ```bash
    npm start
    ```
3.  You should see the message: `Server is running on port 3000`. Your server is now live\!
4.  Open a web browser and navigate to **`http://localhost:3000/users`**.

You will see the array of users displayed in your browser, formatted as JSON.

```json
[
    {
        "id": 1,
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com"
    },
    {
        "id": 2,
        "name": "Bob Smith",
        "email": "bob.smith@example.com"
    },
    ...
]
```

Congratulations\! You have successfully created a backend API that serves data.

---
