# **HTTP**, **URLs**, **Headers**, and **Status Codes**

---

## 1. **URL, URI, and URN**

Before diving into HTTP, let’s clarify three closely related terms that beginners often confuse.

### **1.1 URL (Uniform Resource Locator)**

A **URL** tells you **where** to find something on the internet — like a home address.

**Example:**

```
https://www.example.com/about
```

**Parts:**

* `https://` → Protocol (how to access it)
* `www.example.com` → Domain (the website address)
* `/about` → Path (the exact location of the resource)

**In simple words:**

> A URL gives the *exact address* of a resource and how to reach it.

---

### **1.2 URI (Uniform Resource Identifier)**

A **URI** is a **broader concept**. It identifies a resource either:

* by its **location** (like a URL), or
* by its **name** (like a URN).

So every **URL** is a **URI**, but not every URI is a URL.

**Examples:**

```
https://www.example.com/about   → URL + URI
urn:isbn:0451450523             → URN + URI
```

---

### **1.3 URN (Uniform Resource Name)**

A **URN** identifies a resource by **name only**, not by its location.

**Example:**

```
urn:isbn:0451450523
```

Here, the `isbn` uniquely names a book — but doesn’t say *where* to find it.

---

### **Key Summary**

| Term    | Full Form                   | Identifies by    | Example                     |
| ------- | --------------------------- | ---------------- | --------------------------- |
| **URL** | Uniform Resource Locator    | Location         | `https://example.com/about` |
| **URN** | Uniform Resource Name       | Name             | `urn:isbn:0451450523`       |
| **URI** | Uniform Resource Identifier | Location or Name | Both above                  |

---

### **1.4 URLs Aren’t Always HTTP**

Not all URLs start with `http://` or `https://`.
A URL just describes *where* to find something — the **protocol** can be different.

#### **Examples**

| URL                                    | Meaning                                 |
| -------------------------------------- | --------------------------------------- |
| `mongodb://localhost:27017/myDatabase` | Connects to a MongoDB database          |
| `ftp://example.com/files`              | Accesses files on an FTP server         |
| `file:///C:/Users/John/document.txt`   | Refers to a local file on your computer |
| `mailto:support@example.com`           | Opens your email app to send a message  |
| `ws://localhost:8080`                  | Connects to a WebSocket server          |

---

## 2. **HTTP and HTTPS**

### **2.1 What is HTTP (HyperText Transfer Protocol)?**

* It’s a **set of rules** that defines how your browser and a web server communicate.
* Every time you visit a website, your browser sends an HTTP **request** and gets an HTTP **response** back.

**Example:**
When you go to `http://example.com`, your browser says:

> “Hey server, please give me the page at `/`.”

---

### **2.2 What is HTTPS (HTTP Secure)?**

* HTTPS is just **HTTP + security (encryption)**.
* The **‘S’** stands for **Secure**.
* It uses **SSL/TLS encryption** to protect your data.

**Simple analogy:**

* **HTTP:** Sending a postcard — anyone can read it.
* **HTTPS:** Sending a sealed letter — only sender and receiver can read it.

---

### **2.3 Difference Between HTTP and HTTPS**

| Feature             | **HTTP**                       | **HTTPS**                          |
| ------------------- | ------------------------------ | ---------------------------------- |
| **Full form**       | HyperText Transfer Protocol    | HyperText Transfer Protocol Secure |
| **Security**        | Not secure                     | Encrypted using SSL/TLS            |
| **Port used**       | 80                             | 443                                |
| **Data protection** | Anyone can read or modify data | Data is encrypted and safe         |
| **SSL certificate** | Not required                   | Required                           |
| **Use case**        | Internal/testing sites         | Live/secure websites               |
| **Browser icon**    | “Not Secure”                   | Padlock symbol (🔒)                |

**In short:**

> **HTTPS = HTTP + Encryption + Trust**


### Not All URLs Use HTTP/HTTPS

A URL is any locator with a protocol, not just HTTP/HTTPS. It can be `mongodb://`, `ftp://`, `file://`, `ws://`, etc.

**MongoDB example**

```
mongodb://localhost:27017/myDatabase
```

* `mongodb://` → protocol (MongoDB, not HTTP)
* `localhost` → host
* `27017` → default MongoDB port
* `/myDatabase` → database name

**Other non-HTTP URL examples**

| URL                                  | Meaning                    |
| ------------------------------------ | -------------------------- |
| `ftp://example.com/files`            | FTP file server            |
| `mailto:support@example.com`         | Opens default email client |
| `file:///C:/Users/John/document.txt` | Local file path            |
| `ws://localhost:8080`                | WebSocket connection       |

---

## 3. **HTTP Headers and Metadata**

### **3.1 What are Headers?**

Headers are **extra information** sent with every request and response in the form of **key–value pairs**.

They describe:

* Who is sending the request
* What data type is being sent
* Whether caching or authentication is required
* And how the data should be handled

**Analogy:**
Headers are like **labels on a parcel**. They don’t change the content but explain *how* to handle it.

---

### **3.2 What is Metadata?**

**Metadata** means **“data about data.”**
It provides **details about the main content** but isn’t the content itself.

**Example (outside the web):**

* A photo’s metadata = camera model, time taken, location, file size.

**Example (in HTTP):**

* Request’s metadata = content type, authorization token, cache settings, etc.

---

### **3.3 Header Types**

| Type                       | Who Sends It | Description                               | Examples                                      |
| -------------------------- | ------------ | ----------------------------------------- | --------------------------------------------- |
| **Request Headers**        | Client       | Sent by the browser/app to the server     | `Accept`, `User-Agent`, `Authorization`       |
| **Response Headers**       | Server       | Sent back to client with extra info       | `Content-Type`, `Set-Cookie`, `Cache-Control` |
| **Representation Headers** | Both         | Describe how data is formatted or encoded | `Content-Encoding`, `Content-Language`        |
| **Payload Headers**        | Both         | Describe the actual message body          | `Content-Length`, `Content-Disposition`       |

---

### **3.4 Common Header Fields**

| Header                             | Meaning                              |
| ---------------------------------- | ------------------------------------ |
| **Accept: application/json**       | The client wants data in JSON format |
| **User-Agent: Chrome/126**         | Identifies the browser or client     |
| **Authorization: Bearer <token>**  | Sends authentication credentials     |
| **Content-Type: application/json** | The body is in JSON format           |
| **Cookie: session_id=1234**        | Sends stored cookies for a session   |
| **Cache-Control: no-cache**        | Do not use cached copies of data     |

---

### **3.5 CORS (Cross-Origin Resource Sharing)**

Browsers block cross-site requests for security.
CORS headers tell the browser which external domains are allowed.

**Common CORS headers:**

| Header                             | Function                              |
| ---------------------------------- | ------------------------------------- |
| `Access-Control-Allow-Origin`      | Allows specific domains               |
| `Access-Control-Allow-Methods`     | Lists allowed HTTP methods            |
| `Access-Control-Allow-Credentials` | Allows cookies/auth data to be shared |

---

### **3.6 Security Headers**

| Header                         | Purpose                                           |
| ------------------------------ | ------------------------------------------------- |
| `Cross-Origin-Embedder-Policy` | Controls cross-origin resource embedding          |
| `Cross-Origin-Opener-Policy`   | Protects data isolation between browsing contexts |
| `Content-Security-Policy`      | Prevents loading of untrusted scripts/resources   |
| `X-XSS-Protection`             | Blocks cross-site scripting (XSS) attacks         |

---

## 4. **HTTP Methods (Verbs)**

These methods define **what kind of action** you want to perform on a resource.

| Method      | Purpose                             | Analogy                          |
| ----------- | ----------------------------------- | -------------------------------- |
| **GET**     | Retrieve a resource                 | “Show me the menu.”              |
| **HEAD**    | Same as GET but only headers        | “Just tell me the calorie info.” |
| **POST**    | Create or send new data             | “Place a new order.”             |
| **PUT**     | Replace an existing resource        | “Replace my entire order.”       |
| **PATCH**   | Modify part of a resource           | “Change just the drink.”         |
| **DELETE**  | Remove a resource                   | “Cancel my order.”               |
| **OPTIONS** | Ask what methods are allowed        | “What can I do here?”            |
| **TRACE**   | Diagnostic test (echo back request) | “Repeat my words back to me.”    |

---

## 5. **HTTP Status Codes**

Status codes are **three-digit numbers** returned by the server to show what happened after a request — like a **traffic light** system for web communication.

---

### **5.1 Categories of Status Codes**

| Range   | Category      | Meaning                                    |
| ------- | ------------- | ------------------------------------------ |
| **1xx** | Informational | The request was received; still processing |
| **2xx** | Success       | The request succeeded                      |
| **3xx** | Redirection   | The resource moved elsewhere               |
| **4xx** | Client Error  | The client made a mistake                  |
| **5xx** | Server Error  | The server failed to handle the request    |

---

### **5.2 Common Status Codes Explained**

| Code    | Meaning               | Category          | Description                                         |
| ------- | --------------------- | ----------------- | --------------------------------------------------- |
| **100** | Continue              | 1xx Informational | The client should continue sending the request body |
| **102** | Processing            | 1xx Informational | The server is still processing; no response yet     |
| **200** | OK                    | 2xx Success       | Everything worked perfectly                         |
| **201** | Created               | 2xx Success       | A new resource has been created                     |
| **202** | Accepted              | 2xx Success       | Request accepted, but processing is still ongoing   |
| **307** | Temporary Redirect    | 3xx Redirection   | Resource moved temporarily                          |
| **308** | Permanent Redirect    | 3xx Redirection   | Resource moved permanently                          |
| **400** | Bad Request           | 4xx Client Error  | The request syntax or data is invalid               |
| **401** | Unauthorized          | 4xx Client Error  | Authentication is missing or invalid                |
| **402** | Payment Required      | 4xx Client Error  | Reserved; rarely used (for paid APIs, etc.)         |
| **404** | Not Found             | 4xx Client Error  | The requested resource doesn’t exist                |
| **500** | Internal Server Error | 5xx Server Error  | Something went wrong on the server                  |
| **504** | Gateway Timeout       | 5xx Server Error  | The server didn’t respond in time                   |

---

### **5.3 Quick Real-World Analogy**

| Situation                              | Status Code | Meaning            |
| -------------------------------------- | ----------- | ------------------ |
| Waiter says “Still taking your order.” | 100         | Continue           |
| Chef is preparing your food.           | 102         | Processing         |
| Meal served successfully.              | 200         | OK                 |
| New dish added to the menu.            | 201         | Created            |
| Restaurant moved temporarily.          | 307         | Temporary Redirect |
| You filled out the order wrong.        | 400         | Bad Request        |
| You didn’t show your membership card.  | 401         | Unauthorized       |
| The dish doesn’t exist.                | 404         | Not Found          |
| The kitchen caught fire!               | 500         | Server Error       |

---

## 6. **Summary Table**

| Concept              | Description                                        | Example                          |
| -------------------- | -------------------------------------------------- | -------------------------------- |
| **URL**              | Address of a resource                              | `https://example.com/home`       |
| **URI**              | Identifies resource by name or location            | `urn:isbn:0451450523`            |
| **URN**              | Name-only identifier                               | `urn:isbn:0451450523`            |
| **HTTP**             | Communication protocol (plain text)                | `http://example.com`             |
| **HTTPS**            | Encrypted HTTP                                     | `https://example.com`            |
| **Header**           | Metadata (key–value pairs) with requests/responses | `Content-Type: application/json` |
| **Metadata**         | Data about data — describes format, encoding, etc. | `Cache-Control`, `User-Agent`    |
| **CORS**             | Controls cross-domain access                       | `Access-Control-Allow-Origin`    |
| **Security Headers** | Protect from attacks                               | `Content-Security-Policy`        |
| **Methods**          | Define actions (GET, POST, etc.)                   | `GET /users`                     |
| **Status Codes**     | Server response messages                           | `200 OK`, `404 Not Found`        |

---

### **Final Takeaway**

* **HTTP** handles *how* the web communicates.
* **HTTPS** adds *security* to that communication.
* **Headers** add *metadata* to describe the data being exchanged.
* **CORS and Security headers** protect users and applications.
* **Methods** tell the server *what action* to perform.
* **Status codes** explain *what happened* after your request.

---
