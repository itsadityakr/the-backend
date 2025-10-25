# Serving JSON with Express.js

## What is JSON? (The Core Concept)

Before we look at the code, we must understand what JSON is.

Imagine you want to describe a person using a simple, organized list on a piece of paper. You might write it like this:

  * Name: Aditya Kumar
  * Login ID: itsadityakr
  * User Type: User

This is a **key-value** format. "Name" is the key, and "Aditya Kumar" is the value. This format is simple, predictable, and easy for anyone to read.

**JSON (JavaScript Object Notation)** is simply a way to write down data in this same key-value style, but with a specific syntax that computers can easily understand. The example above, written in JSON, would look like this:

```json
{
  "name": "Aditya Kumar",
  "login": "itsadityakr",
  "type": "User"
}
```

JSON is the most popular format for sending data between servers and web applications because it is lightweight and easy to work with.

-----

### **`res.json()` vs. `res.send()`**

While both methods can send a response from the server, they have important differences in how they behave and what they are designed for. When building an API, understanding these differences is crucial.

| Feature | `res.send()` (The Generalist) | `res.json()` (The Specialist) |
| :--- | :--- | :--- |
| **Primary Purpose** | A versatile, all-purpose method. It can send text, HTML, raw data (buffers), and even JavaScript objects. | Specialized for one task: sending a response in **JSON format**. |
| **`Content-Type` Header** | **Infers** the header based on the input. For a string, it sets `text/html`. For an object, it usually correctly sets `application/json`, but it's not guaranteed. | **Always** sets the `Content-Type` header to `application/json`, explicitly telling the browser the data is JSON. This is more reliable. |
| **Data Transformation** | Automatically stringifies JavaScript objects and arrays. | Also stringifies objects and arrays but applies JSON-specific formatting rules for consistency (e.g., removing `undefined` properties). |
| **Handling of `null` & `undefined`** | If you pass an object, it will convert `null` values but will omit keys with `undefined` values. | Follows the official JSON specification. It correctly converts `null` and omits keys with `undefined` values. This ensures a valid JSON output. |
| **Best Use Case** | Best for sending simple, non-JSON responses like a piece of HTML (`res.send('<h1>Hello</h1>')`) or plain text (`res.send('OK')`). | The **only** method you should use when you intend to send data as a JSON API response. |

**Key Takeaway:** Think of it like tools. `res.send()` is a multi-tool; it can do many things but isn't perfect for any specific job. `res.json()` is a specialized screwdriver; it does one thing (sending JSON) perfectly every time. For building reliable APIs, always use the specialized tool: **`res.json()`**.

-----

Here is the complete code for our server. Below, we will dissect it piece by piece.

```javascript
// index.js

require("dotenv").config();

const express = require("express");
const app = express();

const githubUserData = {
  login: "itsadityakr",
  id: 2711,
  html_url: "https://github.com/itsadityakr",
  type: "User",
  user_view_type: "public",
  name: "Aditya Kumar",
};

app.get("/", (req, res) => {
  res.json(githubUserData);
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
```

### **Setting up the Server**

```javascript
const express = require("express");
const app = express();
```

  * **`const express = require("express");`**: Think of Express as a toolkit for building web servers. This line says, "I need to use the Express toolkit that I installed earlier."
  * **`const app = express();`**: This line takes the toolkit and builds the actual server application. From now on, the variable `app` represents our server.

### **Preparing the Data**

```javascript
const githubUserData = {
  login: "itsadityakr",
  id: 2711,
  html_url: "https://github.com/itsadityakr",
  type: "User",
  user_view_type: "public",
  name: "Aditya Kumar",
};
```

  * Here, we are creating a standard JavaScript object. It is **not yet JSON**. It is just an object in our code that holds our sample data in a key-value format, exactly like the "person description" example.

### **The Main Logic - Handling a Request**

This is the most important part of the code.

```javascript
app.get("/", (req, res) => {
  res.json(githubUserData);
});
```

  * **`app.get("/", ...)`**: This tells our server, "When someone tries to **GET** information from my main page (`/`), I want you to run the following instructions." (Visiting a URL in a browser is a GET request).
  * **`(req, res) => { ... }`**: This is the function containing the instructions. It gets two important tools: `req` (the user's request) and `res` (the response we will send back).
  * **`res.json(githubUserData)`**: This is the key instruction. It tells our server:
    1.  Take the `githubUserData` JavaScript object.
    2.  **Convert it into a proper JSON string**.
    3.  Send this JSON string back to the user who made the request.
    4.  Crucially, it also adds a special label to the response called a **header** (`Content-Type: application/json`). This header tells the browser, "The data I am sending you is JSON, not plain text or HTML."

-----

## What happens

You will see the following output rendered neatly in your browser window:

```json
{
    "login": "itsadityakr",
    "id": 2711,
    "html_url": "https://github.com/itsadityakr",
    "type": "User",
    "user_view_type": "public",
    "name": "Aditya Kumar"
}
```
---
