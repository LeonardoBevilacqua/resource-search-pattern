import express from "express";
import productController from "./products/product.controller.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/products", productController);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.debug(`Server running on port ${PORT}`);
  console.debug(`Health check: http://localhost:${PORT}/health`);
});
