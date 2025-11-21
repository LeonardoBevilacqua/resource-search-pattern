import { filter } from "./utils/filter.js";
import products from "./products.json" with { type: "json" };

export default class ProductRepository {
  applyFilters(searchQuery) {
    let filteredProducts = [...products];

    filteredProducts = filter(searchQuery, filteredProducts);
    return this.toPage(searchQuery, filteredProducts);
  }

  toPage(searchQuery, filteredProducts) {
    const page = searchQuery.page || 1;
    const limit = searchQuery.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
        hasNext: endIndex < filteredProducts.length,
        hasPrev: page > 1,
      },
    };
  }
}
