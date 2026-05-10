![Pershia Logo](<Pershia logo.png>)

<h1 align="center">Pershia — AI Fashion App</h1>

<p align="right">
  <img src="https://img.shields.io/badge/STATUS-IN%20DEVELOPMENT-green">
</p>

## About the Project

Pershia is a web app built to tackle a common modern problem: **Fast Fashion**. The fashion industry generates roughly 20% of global wastewater and consumes around 93 billion cubic meters of water per year.

Pershia's solution is to help users get more out of the clothes they already own. Users upload photos of their wardrobe and the AI analyzes each garment — extracting color, fabric, category, and style — then recommends outfits by combining existing pieces. No new clothes needed.

---

## Installation

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- A NVIDIA NIM API key (for Qwen vision model access)
- A Google OAuth Client ID (for authentication)

### Steps

**1. Clone the repository**

```bash
git clone https://github.com/your-username/Pershia.git
cd Pershia
```

**2. Set up environment variables**

Copy the example env file and fill in your credentials:

```bash
cp backend/wardrobe/.env.example .env
```

Edit `.env` with your values:

```env
# Database
POSTGRES_DB=pershia_db
POSTGRES_USER=pershia
POSTGRES_PASSWORD=pershia_password

# JWT
JWT_SECRET_KEY=your_secure_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# NVIDIA NIM (Qwen)
NVIDIA_API_KEY=your_nvidia_api_key

# AWS S3 (optional — local file storage is used by default)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=pershia-images
```

**3. Start all services**

```bash
docker compose up --build
```

This starts three services:
- **PostgreSQL** (with pgvector) on port `5433`
- **FastAPI backend** on port `8000`
- **Next.js frontend** on port `8080`

**4. Run database migrations**

In a separate terminal, once the containers are running:

```bash
docker compose run --rm alembic-cli alembic upgrade head
```

**5. Open the app**

Navigate to [http://localhost:8080](http://localhost:8080)

The API docs are available at [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Usage

### Wardrobe Management

Upload a photo of any clothing item and Pershia automatically:
- Removes the background from the image (processed in-browser, no server needed)
- Sends the image to Qwen via NVIDIA NIM to extract metadata: color, fabric, category, and style
- Saves the garment to your personal wardrobe

Garments are organized by category and can be filtered, grouped into collections, or used to build outfits.

### Outfit Builder

The drag-and-drop outfit designer lets you combine garments from your wardrobe into saved outfits. Outfits are stored and can be reviewed or deleted at any time.

### AI Outfit Recommendations

The recommendation feature analyzes your entire wardrobe visually and generates outfit combinations suited to a context you describe (e.g. "casual weekend" or "work meeting"). The AI returns three distinct outfit options with titles and descriptions.

### Collections

Group garments into named collections to organize your wardrobe by season, occasion, or any criteria you choose.

---

## Technologies

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 + React 19 | App framework and routing |
| **Styling** | Tailwind CSS v4 | Utility-first styling |
| **UI Components** | Headless UI, Heroicons, MUI | Accessible components and icons |
| **State / Data** | TanStack React Query + Axios | Server state management and HTTP |
| **Background Removal** | @imgly/background-removal + ONNX Runtime Web | In-browser AI background removal (WebGL2) |
| **Auth** | Google OAuth (@react-oauth/google) | User authentication |
| **Backend** | FastAPI (Python 3.12) | REST API and business logic |
| **AI / Vision** | Qwen 3.5 via NVIDIA NIM (LangChain) | Garment analysis and outfit recommendations |
| **Database** | PostgreSQL 16 + pgvector | Relational storage with vector support |
| **ORM / Migrations** | SQLModel + Alembic | Schema management and async queries |
| **Containerization** | Docker + Docker Compose | Multi-service orchestration |
| **Image Storage** | Local filesystem / AWS S3 | Garment image storage |

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check |
| `POST` | `/api/garments/` | Upload and analyze a garment |
| `GET` | `/api/garments/` | List user garments |
| `DELETE` | `/api/garments/{id}` | Delete a garment |
| `GET` | `/api/outfits/` | List user outfits |
| `POST` | `/api/outfits/` | Create an outfit |
| `GET` | `/api/collections/` | List collections |
| `POST` | `/api/collections/` | Create a collection |
| `POST` | `/api/recommendation/` | Get AI outfit recommendations |

---

## Team

| Name | Role |
| :--- | :--- |
| Iosset Ivan Sandoval Gonzalez | Project Manager |
| Oscar Josue Lopez Gonzalez | Frontend |
| Rodrigo Alonso Castillo Ramirez | Frontend |
| Sebastian Sanchez Espinosa | Backend |
| Adin Jared Rosas Silva | Database |
| Miguel Omar Flores García | DevOps |
| Yohance Garrett Lopez | Pizzas & Chescos & Backend |

---

## License

MIT
