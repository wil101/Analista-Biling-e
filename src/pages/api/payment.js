import crypto from "crypto";

export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { product } = req.body;

  if (!product) {
    return res.status(400).json({ message: "Missing product information" });
  }

  // Variables de entorno
  const login = process.env.NEXT_PUBLIC_LOGIN;
  const secretKey = process.env.NEXT_PUBLIC_SECRETKEY;
  const serviceUrl = process.env.NEXT_PUBLIC_SERVICE;

  if (!login || !secretKey || !serviceUrl) {
    return res.status(500).json({ message: "Missing required configuration" });
  }

  // Crear autenticación
  const seed = new Date().toISOString();
  const rawNonce = crypto.randomBytes(16);
  const nonce = rawNonce.toString("base64");
  const tranKey = crypto
    .createHash("sha256")
    .update(Buffer.concat([rawNonce, Buffer.from(seed), Buffer.from(secretKey)]))
    .digest("base64");

  const auth = { login, tranKey, nonce, seed };

  const paymentData = {
    auth,
    payment: {
      reference: `ORDER-${product.id}-${Date.now()}`,
      amount: {
        currency: "COP",
        total: product.price,
      },
      description: product.description,
    },
    returnUrl: "http://localhost:3000/success",
    expiration: new Date(Date.now() + 3600 * 1000).toISOString(),
  };

  try {
    const response = await fetch(serviceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Mostrar detalles de error
      throw new Error(`Service error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.processUrl) {
      throw new Error("Response missing processUrl");
    }

    // Devolver el proceso al cliente
    return res.status(200).json({ processUrl: data.processUrl });
  } catch (error) {
    console.error("Payment Error:", error.message);
    return res.status(500).json({
      message: "Payment request failed",
      error: error.message,
    });
  }
}
