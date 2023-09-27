export const incrementQuantity = (products, productId) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return { ...product, quantity: product.quantity + 1 };
      }
      return product;
    });
    return updatedProducts;
  };
  
  export const decrementQuantity = (products, productId) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId && product.quantity > 1) {
        return { ...product, quantity: product.quantity - 1 };
      }
      return product;
    });
    return updatedProducts;
  };
  