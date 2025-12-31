import express from "express";
import routes from "./routes/index.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api", routes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
