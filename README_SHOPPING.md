# Shopping Cart Demo (VS Code deployment option)

This is a small demo shopping cart app (Node + Express backend serving a static frontend). It runs on port 3000 by default.

Quick start (locally with Docker):

1. Build and run with Docker Compose (recommended in VS Code):

```bash
docker-compose up --build -d
```

2. Open in browser: http://localhost:3000

VS Code deployment options:

- Use the **Run Task** command (`Terminal: Run Task`) and choose `Docker Compose: Up (build)` to build and run the app via Docker Compose.
- To deploy to a cloud provider that supports containers (for example Azure App Service), build a container image (the Dockerfile is at the repository root) and use the provider's VS Code extension (e.g., **Azure App Service**) to push/deploy the container.

Notes:

- The backend stores cart data in-memory (demo only). Restarting the container will reset the cart.
- Endpoints:
  - `GET /api/products` — list products
  - `GET /api/cart` — view cart
  - `POST /api/cart` — add item { id, quantity }
  - `DELETE /api/cart/:id` — remove item
  - `POST /api/checkout` — clear cart (demo)
