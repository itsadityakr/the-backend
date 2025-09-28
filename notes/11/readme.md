# `async` `await`

## 1. The Problem `async/await` Solves

JavaScript is single-threaded, meaning it can only do one thing at a time.
But real-world applications often need to handle slow operations such as:

* Fetching data from an API
* Reading or writing files
* Querying a database
* Waiting for a timer

If JavaScript just waited for these tasks, the whole program would freeze.
To avoid that, JavaScript uses asynchronous programming.

Older solutions:

* Callbacks → messy and hard to read ("callback hell")
* Promises → cleaner, but still uses `.then()` chains
* `async/await` → modern approach, making async code look synchronous

---

## 2. What is `async`?

* `async` is a keyword placed before a function.
* It ensures the function always returns a Promise.

Example:

```js
async function hello() {
  return "Hello World";
}

hello().then(console.log); // "Hello World"
```

Even though the function returns a string, it is wrapped as:

```js
Promise.resolve("Hello World");
```

---

## 3. What is `await`?

* `await` can only be used inside an `async` function (except top-level `await` in modern JS modules).
* It pauses execution of that function until the Promise resolves or rejects.

Example:

```js
function getNumber() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(42), 2000);
  });
}

async function demo() {
  console.log("Before await");
  const num = await getNumber();
  console.log("Got:", num);
  console.log("After await");
}

demo();
```

Output:

```
Before await
... (2 second delay)
Got: 42
After await
```

---

## 4. Error Handling with `async/await`

Instead of `.catch()`, you use `try...catch`:

```js
async function fetchData() {
  try {
    let response = await fetch("https://invalid-url.com");
    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
```

---

## 5. Sequential vs Parallel Execution

A common mistake is awaiting tasks one after another, when they can run in parallel.

Sequential (slower):

```js
async function run() {
  const a = await task1();
  const b = await task2();
  return [a, b];
}
```

Parallel (faster):

```js
async function run() {
  const [a, b] = await Promise.all([task1(), task2()]);
  return [a, b];
}
```

---

## 6. Mixing `async/await` with Promises

`async/await` works seamlessly with Promises.

```js
async function example() {
  return Promise.resolve("Hello!");
}

example().then(console.log); // Hello!
```

---

## 7. Real-World Example

```js
async function getUser(id) {
  try {
    let res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    let user = await res.json();
    console.log(user);
  } catch (err) {
    console.error("Failed to fetch user:", err);
  }
}

getUser(1);
```

---

## 8. Key Rules

1. `await` can only be used inside an `async` function, or at the top-level in ES modules.
2. An `async` function always returns a Promise.
3. Use `try...catch` for error handling.
4. Use `Promise.all` for tasks that can run concurrently.
5. `await` makes code look synchronous, but execution is still non-blocking.

---

## 9. Top-Level `await` (Modern JS)

In ES modules (`.mjs` files or when `"type": "module"` is set in package.json), you can use `await` outside of functions:

```js
// index.mjs
const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
const data = await res.json();
console.log(data);
```

---

## 10. Benefits

* Code is easier to read compared to callbacks and `.then()` chains.
* Error handling with `try...catch` is straightforward.
* Works naturally with Promises.
* Reduces deeply nested code.

---

## 11. When Not to Use `await`

1. Inside loops, if tasks can run in parallel.
   Example:

```js
// Slow - one by one
for (let url of urls) {
  const res = await fetch(url);
  console.log(await res.text());
}

// Faster - in parallel
const results = await Promise.all(urls.map(url => fetch(url)));
```

2. When you need "fire and forget" behavior (don’t want to wait for the result).

---

In summary:

* `async` makes a function return a Promise.
* `await` pauses execution until a Promise resolves or rejects.
* Together, they let you write asynchronous code that looks synchronous.

---
