const express = require("express");

// express() // server created

const app1 = express(); // creating server instance (app is an object) server created
const app2 = express(); // creating server instance (app is an object) server created
// console.log(app);

app1.get("/", (req, res) => {
    res.send("Hello World");
});

app2.get("/", (req, res) => {
    res.send("About");
});

app1.listen(3000); // server started
app1.listen(4050); // server started
// app2.listen(3000); // error
app2.listen(3001); // server started
