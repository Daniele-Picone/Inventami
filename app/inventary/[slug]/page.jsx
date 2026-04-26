"use client";

import { useParams } from "next/navigation";

import WineInventory from "../../components/WineInventary";


export default function InventarioPage() {
  const { slug } = useParams();

  const renderComponent = () => {
    switch (slug) {
      case "wine":
        return <WineInventory />;

      case "food":
        return <FoodInventory />;

      case "beverage":
        return <BeverageInventory />;

      default:
        return <h1>Categoria non trovata</h1>;
    }
  };

  return (
    <div className="container">
      <h1>📦 Inventario: {slug}</h1>
      {renderComponent()}
    </div>
  );
}