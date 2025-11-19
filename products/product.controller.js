import { Router } from "express";
import SearchStore from "../searches/searchStore.js";
import ProductRepository from "./product.repository.js";

const productController = Router();
const searchStore = new SearchStore();
const productRepository = new ProductRepository();

// 1. Create a search resource
productController.post("/search", (req, res) => {
  try {
    const searchQuery = req.body;

    // Validate the search query
    if (!searchQuery || typeof searchQuery !== "object") {
      return res.status(400).json({
        error: "Invalid search query",
        message: "Search query must be a valid JSON object",
      });
    }

    // Create the search resource
    const search = searchStore.createSearch(searchQuery);

    // Return the search resource location
    res.status(201).json({
      searchId: search.id,
      message: "Search resource created successfully",
      expiresAt: search.expiresAt.toISOString(),
      links: {
        results: `/api/products?search_id=${search.id}`,
        self: `/api/product-search/${search.id}`,
      },
    });
  } catch (error) {
    console.error("Error creating search:", error);
    res.status(500).json({
      error: "Could not create search resource",
    });
  }
});
// 2. Get search results (the cacheable GET endpoint)
productController.get("/", (req, res) => {
  try {
    const searchId = req.query.search_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let searchQuery;

    if (searchId) {
      const search = searchStore.getSearch(searchId);

      if (!search) {
        return res.status(404).json({
          error: "Search not found",
          message: "The search Id is invalid or has expired",
        });
      }

      searchQuery = search.query;
    } else {
      // Allow direct simple filtering without search resource
      searchQuery = {
        filters: {
          category: req.query.category,
          brand: req.query.brand,
          inStock: req.query.inStock ? req.query.inStock === "true" : undefined,
        },
        page,
        limit,
      };
    }

    // Apply filters and get results
    const result = productRepository.applyFilters(searchQuery);

    // Set cache headers for the results
    res.set({
      "Cache-Control": "public, max-age=300", // 5 minutes cache
      ETag: `"${Buffer.from(JSON.stringify(result)).toString("base64")}"`,
    });

    res.json({
      data: result.products,
      pagination: result.pagination,
      searchId: searchId || null,
      links: {
        self: req.originalUrl,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not fetch products",
    });
  }
});
// 3. Get serach resourse details (optional)
productController.get("/search/:searchId", (req, res) => {
  try {
    const { searchId } = req.params;
    const search = searchStore.getSearch(searchId);

    if (!search) {
      return res.status(404).json({
        error: "Search not found",
        message: "The search Id is Invalid or has expired",
      });
    }

    res.json({
      searchId: search.id,
      query: search.query,
      createdAt: search.createdAt,
      expiresAt: search.expiresAt,
      links: {
        results: `/api/products?search_id=${search.id}`,
      },
    });
  } catch (error) {
    console.error("Error fetching search:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Could not fetch search resource",
    });
  }
});

export default productController;
