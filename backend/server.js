const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const router = require("./routes/router");
const cors = require("cors");
const app = express();
const path = require("path");
const connectToDB = require("./db");
connectToDB();
app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND_PATH],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", router);

app.use(express.static(path.join(__dirname, `../frontend/build`)));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, `../frontend/build/index.html`));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`running on port ${PORT}`));
