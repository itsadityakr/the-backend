# Error Handling in JS

---

## 1. What is an Error?

An **error** is an object that represents something unexpected happening in your program.
Common built-in error types:

* `Error` (base class)
* `TypeError`
* `ReferenceError`
* `SyntaxError`
* `RangeError`
* `EvalError`
* `URIError`

Example:

```js
throw new Error("Something went wrong");
```

---

## 2. Basic Error Handling: `try...catch`

JavaScript provides `try...catch` blocks to handle errors gracefully.

```js
try {
  let x = y + 1; // y is not defined
} catch (err) {
  console.error("Caught an error:", err.message);
}
```

Output:

```
Caught an error: y is not defined
```

* `try` → code that might fail
* `catch` → code to handle errors
* `err` → the error object

---

## 3. Adding `finally`

The `finally` block always runs, regardless of whether an error happened.

```js
try {
  console.log("Start");
  throw new Error("Oops");
} catch (err) {
  console.log("Caught:", err.message);
} finally {
  console.log("Cleanup runs no matter what");
}
```

Output:

```
Start
Caught: Oops
Cleanup runs no matter what
```

---

## 4. Throwing Errors Manually

You can throw errors yourself when something invalid happens.

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  console.log(divide(10, 0));
} catch (err) {
  console.error(err.message);
}
```

---

## 5. Asynchronous Error Handling

Errors in async code don’t behave the same as synchronous ones.

#### a) With Promises

```js
function asyncTask() {
  return new Promise((_, reject) => {
    reject(new Error("Promise failed"));
  });
}

asyncTask().catch(err => {
  console.error("Caught:", err.message);
});
```

#### b) With `async/await`

You must use `try...catch` around `await`.

```js
async function run() {
  try {
    let res = await fetch("https://invalid-url.com");
    let data = await res.json();
    console.log(data);
  } catch (err) {
    console.error("Async error:", err.message);
  }
}
run();
```

---

## 6. Global Error Handling

Sometimes errors slip through. JavaScript gives global handlers.

#### a) In browsers

```js
window.onerror = function (message, source, lineno, colno, error) {
  console.error("Global error caught:", message);
};
```

#### b) For unhandled Promise rejections

```js
window.onunhandledrejection = function (event) {
  console.error("Unhandled rejection:", event.reason);
};
```

---

## 7. Custom Error Classes

You can extend the built-in `Error` to make your own types.

```js
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateAge(age) {
  if (age < 18) throw new ValidationError("Must be at least 18");
  return true;
}

try {
  validateAge(15);
} catch (err) {
  console.error(err.name + ": " + err.message);
}
```

---

## 8. Best Practices

1. Use specific error types when possible (`TypeError`, `RangeError`, custom classes).
2. Always handle errors in async code (`try...catch` or `.catch()`).
3. Avoid swallowing errors silently.
4. Use `finally` for cleanup (closing files, connections, etc.).
5. Log errors with enough detail for debugging.
6. Don’t leak sensitive data (like stack traces) to end users.

---

To summarize:

* **Synchronous code** → use `try...catch`.
* **Async with Promises** → use `.catch()`.
* **Async with `await`** → wrap in `try...catch`.
* **Global safety nets** exist but should be last resort.
* **Custom errors** improve clarity.

---
