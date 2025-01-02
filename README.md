# Tienda de Productos - Integración con Pasarela de Pagos

Este proyecto es una aplicación web desarrollada con **Next.js** y **TypeScript** que permite a los usuarios comprar productos a través de una pasarela de pagos. A continuación, se describe cómo configurar y ejecutar el proyecto, así como los aspectos técnicos relevantes.

## Requisitos Previos

- Node.js (versión 16 o superior).
- npm o yarn.
- Claves de acceso para la pasarela de pagos (proporcionadas por el servicio de pagos que estás utilizando).

## Configuración Inicial

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

```plaintext
NEXT_PUBLIC_LOGIN=your_login
NEXT_PUBLIC_SECRETKEY=your_secret_key
NEXT_PUBLIC_SERVICE=https://example-payment-service.com/api
```

- `NEXT_PUBLIC_LOGIN`: Identificador de acceso para la pasarela de pagos.
- `NEXT_PUBLIC_SECRETKEY`: Clave secreta proporcionada por el servicio de pagos.
- `NEXT_PUBLIC_SERVICE`: URL del servicio de pagos para procesar las solicitudes.

> **Nota:** Asegúrate de mantener estas claves confidenciales.

### Instalación de Dependencias

Ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
npm install
```

O si usas Yarn:

```bash
yarn install
```

## Estructura del Proyecto

```
project-root/
├── pages/
│   ├── api/
│   │   └── payment.js   # Endpoint para procesar pagos.
│   └── index.tsx        # Página principal de la tienda.
├── public/
├── styles/
├── .env                 # Archivo de variables de entorno.
├── package.json         # Configuración del proyecto.
└── ...
```

## Ejecución del Proyecto

1. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   O con Yarn:

   ```bash
   yarn dev
   ```

2. Abre tu navegador en [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## Descripción de la Funcionalidad

### Cliente

- **Página Principal (`index.tsx`)**:
  - Lista de productos disponibles con su descripción, precio e imagen.
  - Botón "Comprar Ahora" que inicia el proceso de pago al llamar al endpoint `/api/payment`.

### API

- **Ruta `/api/payment`**:
  - Método: `POST`.
  - Proceso:
    1. Recibe los datos del producto enviados por el cliente.
    2. Genera la autenticación requerida para la pasarela de pagos.
    3. Envía una solicitud al servicio de pagos con los detalles del producto.
    4. Devuelve la URL del proceso de pago (`processUrl`) al cliente.

### Flujo de Pago

1. El cliente selecciona un producto y hace clic en "Comprar Ahora".
2. Se envía una solicitud `POST` a `/api/payment` con los detalles del producto.
3. Si la solicitud es exitosa, el cliente es redirigido a la URL de la pasarela de pagos.

## Manejo de Errores

- Si las claves de entorno están incompletas o ausentes, el servidor devuelve un error 500.
- Si la API de la pasarela de pagos responde con un error, este se registra en la consola y se notifica al cliente.
- Se valida que las respuestas de la API contengan un campo `processUrl`. Si falta, se lanza un error.

## Consideraciones Adicionales

- **CORS:** Durante el desarrollo, se configura `Access-Control-Allow-Origin` como `*`. En producción, restringe los dominios permitidos.
- **Seguridad:**
  - No se publicaron claves sensibles en el cliente.
  - Use HTTPS en producción para proteger los datos.
- **Depuración:** Utilice herramientas como Postman para probar el endpoint `/api/payment` y verificar la integración con la pasarela de pagos.

