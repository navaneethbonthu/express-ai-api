import express from "express";
import routes from "./routes/index.js";
import { globalErrorHandler } from "middlewares/error.middleware.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api", routes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// This MUST be the last middleware
app.use(globalErrorHandler);
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
