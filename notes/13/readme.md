# **Promises in JavaScript**.

---

## 1. What is a Promise?

A **Promise** is an object that represents the result of an **asynchronous operation**.
It can be in one of three states:

1. **Pending** → initial state, operation not finished yet
2. **Fulfilled** → operation completed successfully (resolved)
3. **Rejected** → operation failed (error)

---

## 2. Creating a Promise

```js
const myPromise = new Promise((resolve, reject) => {
  let success = true;

  if (success) {
    resolve("Operation succeeded");
  } else {
    reject("Operation failed");
  }
});
```

* `resolve(value)` → marks the Promise as fulfilled
* `reject(error)` → marks the Promise as rejected

---

## 3. Using a Promise

```js
myPromise
  .then(result => {
    console.log("Success:", result);
  })
  .catch(error => {
    console.error("Error:", error);
  })
  .finally(() => {
    console.log("Cleanup always runs");
  });
```

---

## 4. Promise Chaining

You can chain multiple `.then()` calls. Each one returns a new Promise.

```js
new Promise((resolve) => resolve(2))
  .then(num => num * 2)
  .then(num => num * 3)
  .then(result => {
    console.log(result); // 12
  });
```

---

## 5. Promise Error Handling

Errors propagate down the chain until a `.catch()` is found.

```js
new Promise((_, reject) => reject("Something went wrong"))
  .then(() => console.log("This won't run"))
  .catch(err => console.error("Caught:", err));
```

---

## 6. Promise Methods

#### a) `Promise.all`

Runs promises in parallel, waits for all to succeed or one to fail.

```js
Promise.all([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]).then(results => console.log(results)); // [1, 2, 3]
```

If any fail:

```js
Promise.all([
  Promise.resolve(1),
  Promise.reject("Error"),
  Promise.resolve(3)
]).catch(err => console.error(err)); // Error
```

---

#### b) `Promise.allSettled`

Waits for all promises, regardless of success or failure.

```js
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject("Error"),
  Promise.resolve(3)
]).then(results => console.log(results));
```

Output:

```js
[
  { status: "fulfilled", value: 1 },
  { status: "rejected", reason: "Error" },
  { status: "fulfilled", value: 3 }
]
```

---

#### c) `Promise.race`

Returns the result of the **first promise** to settle (success or error).

```js
Promise.race([
  new Promise(res => setTimeout(() => res("Fast"), 100)),
  new Promise(res => setTimeout(() => res("Slow"), 200))
]).then(result => console.log(result)); // "Fast"
```

---

#### d) `Promise.any`

Returns the **first fulfilled promise** (ignores rejections).
If all fail, it rejects with an `AggregateError`.

```js
Promise.any([
  Promise.reject("Error 1"),
  Promise.resolve("Success"),
  Promise.reject("Error 2")
]).then(result => console.log(result)); // "Success"
```

---

## 7. Converting Callback Code to Promises

Before Promises, async operations used callbacks:

```js
function getData(callback) {
  setTimeout(() => {
    callback("Here is your data");
  }, 1000);
}

getData(console.log);
```

With Promises:

```js
function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Here is your data");
    }, 1000);
  });
}

getData().then(console.log);
```

---

## 8. Using Promises with `async/await`

`async/await` is syntactic sugar on top of Promises.

```js
function getNumber() {
  return new Promise(resolve => {
    setTimeout(() => resolve(42), 1000);
  });
}

async function demo() {
  const result = await getNumber();
  console.log(result);
}

demo();
```

---

## 9. Best Practices

1. Always handle errors with `.catch()` or `try...catch` (when using `await`).
2. Use `Promise.all` for parallel tasks that must all succeed.
3. Use `Promise.allSettled` if you need results of all tasks regardless of failure.
4. Avoid deeply nested `.then()` chains — use chaining or `async/await`.
5. Don’t mix callbacks and Promises unnecessarily.

---

In short:

* Promises are the foundation of modern async JavaScript.
* They make handling success/failure cleaner than callbacks.
* `async/await` builds on top of Promises for even cleaner code.

---
