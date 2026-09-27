# 🚀 How to Run PrepIQ AI with Docker

Follow these steps to run the application (with the brand-new modern light theme UI and dynamic landing page) on your computer without installing Node.js, MongoDB, or Redis manually.

---

## 📋 Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your computer.

---

## ▶️ Running the Application

1. **Extract the ZIP file** to any folder on your computer.
2. **Open Terminal / Command Prompt / PowerShell** in the extracted folder.
3. Run the following command:

```bash
docker compose up --build
```

4. Wait a couple of minutes while Docker builds the containers.
5. Once complete, open your browser and navigate to:
   👉 **http://localhost:5173**

---

## 🔑 Customizing Environment Variables (Optional)

If you want to use your own Groq API key or Cloudinary credentials:
1. Copy `.env.example` to `.env` in the root directory.
2. Edit the `.env` file with your credentials.
3. Restart Docker:
   ```bash
   docker compose down
   docker compose up --build
   ```

---

## 🛑 Stopping the Application

To stop all running containers, press `Ctrl + C` in your terminal or run:

```bash
docker compose down
```
