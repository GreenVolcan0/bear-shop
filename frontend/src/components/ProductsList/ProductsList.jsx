import React from "react";
import ProductItem from "../ProductItem/ProductItem";

export default function ProductsList({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="empty">
        Товары не найдены. Добавьте первого медведя!
      </div>
    );
  }

  return (
    <div className="grid">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
