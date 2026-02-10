const app = require("./src/app");

const connectDB = require("./src/db/db");

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

connectDB();
