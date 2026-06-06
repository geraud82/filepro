# Universal File Converter + Online File Compressor

## MVP Web Application

A high-performance web application for file conversion and compression.

### Features
- File Conversion: PDF↔Word, JPG↔PNG, MP4→MP3
- File Compression: PDF, Images (JPG/PNG), Video (MP4)
- Progress tracking with real-time updates
- Free & Premium tiers
- SEO-optimized landing pages
- Auto-deletion of files after 1 hour

### Tech Stack

#### Frontend
- Next.js (React framework)
- TailwindCSS
- Axios for API calls

#### Backend
- Node.js + Express.js
- Redis + BullMQ (job queue)
- FFmpeg (video/audio processing)
- LibreOffice (document conversion)
- Sharp (image processing)
- Ghostscript (PDF compression)

#### Infrastructure
- Docker & Docker Compose
- Nginx (reverse proxy)
- VPS deployment ready

## Setup Instructions

### Prerequisites
- Node.js 18+ LTS
- Docker & Docker Compose
- Git

### Quick Start

1. **Clone and Install**
```bash
cd FilePro
npm install
```

2. **Environment Setup**
```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. **Start with Docker**
```bash
docker-compose up -d
```

4. **Development Mode**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Redis: localhost:6379

## Project Structure
```
FilePro/
├── frontend/          # Next.js application
├── backend/           # Express.js API + Workers
├── docker-compose.yml # Container orchestration
└── README.md
```

## Documentation
See `/docs` folder for detailed documentation on:
- API endpoints
- File processing logic
- Deployment guide
- SEO optimization

## License
MIT
