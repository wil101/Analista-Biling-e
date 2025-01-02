"use client";

import React from "react";
import Head from "next/head";

const products = [
  {
    id: 1,
    name: "Kit de Bálsamo y Tinta",
    description: "Prueba el increíble kit de bálsamo y tinta",
    price: 10000,
    img: "https://res.cloudinary.com/dyq9h1ova/image/upload/t_kit/bvgfywqvpnq7lntq6uca",
  },
  {
    id: 2,
    name: "Promo de Navidad",
    description: "Aprovecha la promo de navidad para conseguir todo tu set de Cosmi",
    price: 10000,
    img: "https://res.cloudinary.com/dyq9h1ova/image/upload/t_Serum1/ls3hed8fslrrvkxiiucy",
  },
  {
    id: 3,
    name: "Serum",
    description: "Serum para que tus pestañas crezcan y se vean más fuertes",
    price: 65000,
    img: "https://res.cloudinary.com/dyq9h1ova/image/upload/t_Serum1/nbjztkagfd8nbmvhqsh7",
  },
];

const processPayment = async (product: {
  id: number;
  name: string;
  description: string;
  price: number;
  img: string;
}) => {
  try {
    const response = await fetch('/api/payment', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Payment request failed");
    }

    const data = await response.json();

    if (data.processUrl) {
      console.log("Payment Response:", data);
      // Redirigir al usuario a la página de pago
      window.location.href = data.processUrl;
    } else {
      throw new Error("Missing process URL in response");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Payment Error:", error.message);
    } else {
      console.error("Payment Error:", error);
    }
    alert("Hubo un problema con el pago. Por favor, inténtalo de nuevo.");
  }
};

const Home = () => {
  return (
    <>
      <Head>
        <title>Tienda de Productos</title>
        <meta
          name="description"
          content="Descubre nuestros productos increíbles y adquiere el tuyo hoy mismo!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white py-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold">Bienvenido a nuestra tienda</h1>
            <p className="mt-2 text-lg">
              Explora nuestros productos y encuentra lo que necesitas
            </p>
          </div>
        </header>
        <section className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <div className="relative w-full h-48">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <p className="text-gray-900 mt-4 text-lg font-semibold">
                    ${product.price.toLocaleString("es-CO")}
                  </p>
                  <button
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    onClick={() => processPayment(product)}
                  >
                    Comprar Ahora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto text-center">
            <p>&copy; 2025 Cosmi. Todos los derechos reservados.</p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;
