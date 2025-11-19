import { filter } from "./utils/filter.js";

export default class ProductRepository {
  products = [
    {
      id: 1,
      name: "iPhone 14",
      category: "electronics",
      price: 999,
      brand: "Apple",
      inStock: true,
    },
    {
      id: 2,
      name: "Samsung Galaxy",
      category: "electronics",
      price: 799,
      brand: "Samsung",
      inStock: true,
    },
    {
      id: 3,
      name: "MacBook Pro",
      category: "computers",
      price: 2399,
      brand: "Apple",
      inStock: false,
    },
    {
      id: 4,
      name: "Dell XPS",
      category: "computers",
      price: 1599,
      brand: "Dell",
      inStock: true,
    },
    {
      id: 5,
      name: "iPad Air",
      category: "tablets",
      price: 599,
      brand: "Apple",
      inStock: true,
    },
    {
      id: 6,
      name: "Surface Pro",
      category: "tablets",
      price: 899,
      brand: "Microsoft",
      inStock: true,
    },
    {
      id: 7,
      name: "Sony Headphones",
      category: "electronics",
      price: 299,
      brand: "Sony",
      inStock: false,
    },
    {
      id: 8,
      name: "Logitech Keyboard",
      category: "accessories",
      price: 99,
      brand: "Logitech",
      inStock: true,
    },
  ];

  applyFilters(searchQuery) {
    let filteredProducts = [...this.products];

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
