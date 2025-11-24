# GenScript - AI Idea Generator

GenScript is a powerful, monolithic web application designed to generate tailored project ideas for developers and researchers. Leveraging advanced AI models, it creates structured prompts for **Research Topics**, **Business Cases**, and **Python Scripts**, complete with monetization strategies and implementation details.

## 🚀 Features

- **AI-Powered Generation**: Generates high-quality, structured ideas using external AI APIs.
- **Three Specialized Modes**:
  - **Research Topics**: In-depth academic and practical research subjects with R.C.T.F.M prompts.
  - **Research & Business**: Business analysis, money/effort estimation, and monetization strategies.
  - **Python Scripts**: Technical script ideas with scalability and implementation details.
- **Local History**: Automatically saves generated ideas to a local SQLite database (`server/ideas.db`).
- **Monolithic Architecture**: Unified React Frontend and Express Backend running in a single instance.
- **Docker Ready**: Fully containerized with a lightweight Alpine image.
- **Cloudflare Tunnel Support**: Pre-configured `docker-compose.yml` for secure public exposure.
- **Localized Content**: Prompts and outputs are optimized for Indonesian language contexts.

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide React.
- **Backend**: Node.js, Express, SQLite (local storage).
- **Deployment**: Docker, Docker Compose, GitHub Actions (for GH Pages).

---

## 🏁 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/genscript.git
   cd genscript
   ```

2. Install dependencies (installs both frontend and backend deps):
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env` and fill in your details.
   ```bash
   cp .env.example .env
   ```

### Local Development

Run both the Frontend (Vite) and Backend (Express) concurrently:

```bash
npm run dev
```

- **Frontend**: `http://localhost:3000` (proxies `/api` to backend)
- **Backend**: `http://localhost:3001`

### Production Build (Local)

To simulate the production environment where Express serves the React build:

```bash
npm run build
npm start
```
Access the app at `http://localhost:3001`.

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

This project includes a `docker-compose.yml` configured for production, optionally with Cloudflare Tunnel.

1. Ensure `.env` is configured with the required variables (see below).
2. Run:
   ```bash
   docker compose up -d --build
   ```

The application will be accessible on the configured `APP_PORT` (default 3002).

### Using Dockerfile Directly

When building the image directly, pass build arguments for the frontend:

```bash
docker build \
  --build-arg VITE_API_KEY=your_key \
  --build-arg VITE_API_ENDPOINT=your_endpoint \
  --build-arg VITE_BASE_URL=/ \
  -t genscript .

docker run -p 3001:3001 --env-file .env genscript
```

---

## ⚙️ Configuration (.env)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_KEY` | API Key for the external AI service. | `sk-...` |
| `VITE_API_ENDPOINT` | URL for the AI Generation API. | `https://api-ai.tegarfirman.site...` |
| `VITE_BASE_URL` | Base path for the application (e.g. `/app/` or `/`). | `/` |
| `VITE_LOCAL_API_ENDPOINT` | Path to the local backend API. Use `/api` for monolithic/docker setups. | `/api` |
| `APP_PORT` | **(Docker)** Host port to expose. | `3002` |
| `CLOUDFLARE_TUNNEL_TOKEN`| **(Docker)** Token for cloudflared tunnel. | `ey...` |

---

## 📂 Project Structure

```
genscript/
├── components/         # React UI Components (IdeaCard, Modals)
├── server/             # Express Backend & SQLite DB logic
│   └── index.js        # Server entry point
├── services/           # Frontend API logic (Generation & Parsing)
├── dist/               # Production build artifacts
├── Dockerfile          # Production Docker image config
├── docker-compose.yml  # Docker orchestration config
└── vite.config.ts      # Vite config (Proxy & Build settings)
```

## 📄 License

[MIT](LICENSE)
