export function filter({ filters }, filteredProducts) {
  if (!filters) return filteredProducts;

  filteredProducts = filterByCategory(filters, filteredProducts);
  filteredProducts = filterByBrand(filters, filteredProducts);
  filteredProducts = filterByPrice(filters, filteredProducts);
  filteredProducts = filterByInStock(filters, filteredProducts);
  filteredProducts = filterByNameContains(filters, filteredProducts);

  return filteredProducts;
}

function filterByCategory({ category }, filteredProducts) {
  if (!category) return filteredProducts;

  return filteredProducts.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase(),
  );
}

function filterByBrand({ brand }, filteredProducts) {
  if (!brand) return filteredProducts;

  return filteredProducts.filter(
    (product) => product.brand.toLowerCase() === brand.toLowerCase(),
  );
}

function filterByPrice({ minPrice, maxPrice }, filteredProducts) {
  filterByMinPrice();
  filterByMaxPrice();

  return filteredProducts;

  function filterByMaxPrice() {
    if (maxPrice === undefined) return;

    filteredProducts = filteredProducts.filter(
      (product) => product.price <= maxPrice,
    );
  }

  function filterByMinPrice() {
    if (minPrice === undefined) return;

    filteredProducts = filteredProducts.filter(
      (product) => product.price >= minPrice,
    );
  }
}

function filterByInStock({ inStock }, filteredProducts) {
  if (inStock === undefined) return filteredProducts;

  return filteredProducts.filter((product) => product.inStock === inStock);
}

function filterByNameContains({ nameContains }, filteredProducts) {
  if (!nameContains) return filteredProducts;

  return filteredProducts.filter((product) =>
    product.name.toLowerCase().includes(nameContains.toLowerCase()),
  );
}
