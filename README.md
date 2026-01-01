# Portfolio Website - Kimberly Miranda

A modern, container-first portfolio website built with Node.js, Express, and Tailwind CSS. Designed to run entirely in Docker containers with no local dependencies required on the host machine.

🌐 **Live Site**: [kimberlymiranda.us](https://kimberlymiranda.us)

## Features

- **Container-First Architecture**: Everything runs inside Docker - no Node.js installation required on host
- **Modern Tech Stack**: Express server, Tailwind CSS, vanilla JavaScript
- **Responsive Design**: Mobile-first approach with accessible navigation
- **Project Showcase**: Dynamic project loading with detailed case studies
- **Professional Resume**: Comprehensive work experience and skills
- **Progressive Enhancement**: Works reasonably well without JavaScript
- **Health Monitoring**: Built-in healthcheck for production deployments

## Quick Start

### Prerequisites

- Docker (20.10 or later)
- Docker Compose (2.0 or later)

**Note**: You do NOT need Node.js installed on your host machine.

### 1. Build and Run with Docker Compose (Recommended)

```bash
# Build and start the container in detached mode
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The website will be available at [http://localhost:3131](http://localhost:3131)

### 2. Alternative: Build and Run with Docker Directly

```bash
# Build the Docker image
npm run docker-build
# or manually:
docker build -t portfolio-website .

# Run the container (foreground)
docker run -p 3131:3131 --name portfolio portfolio-website

# Or run in detached mode
npm run docker-run-detached
# or manually:
docker run -d -p 3131:3131 --name portfolio portfolio-website

# Stop and remove container
docker stop portfolio
docker rm portfolio
```

## Project Structure

```
.
├── Dockerfile                 # Container definition (node:20-alpine)
├── docker-compose.yml         # Compose configuration with healthcheck
├── package.json               # Dependencies and npm scripts
├── server.js                  # Express server
├── public/                    # Static assets
│   ├── index.html            # Home page
│   ├── project.html          # Project detail page (dynamic)
│   ├── resume.html           # Resume page
│   ├── css/
│   │   └── styles.css        # Custom CSS + Tailwind CDN
│   ├── js/
│   │   └── main.js           # Client-side JavaScript
│   ├── data/
│   │   └── projects.json     # Project data
│   └── images/               # Placeholder images
│       ├── ecommerce-project.jpg     (replace with your image)
│       ├── task-manager-project.jpg  (replace with your image)
│       ├── cms-project.jpg           (replace with your image)
│       ├── analytics-project.jpg     (replace with your image)
│       └── fitness-project.jpg       (replace with your image)
├── README.md
└── .dockerignore             # Files excluded from Docker build
```

## Customization

### Adding/Updating Projects

1. Edit `public/data/projects.json` with your project information
2. Each project requires:
   - `slug`: URL-friendly identifier
   - `title`: Project name
   - `category`: Project type
   - `year`: Year completed
   - `shortDescription`: Brief overview (shown on cards)
   - `technologies`: Array of tech stack items
   - `image`: Path to project image (optional)
   - `liveUrl`: Link to live project (optional)
   - Additional fields: `subtitle`, `longDescription`, `highlights`, `challenges`, `outcome`

3. Rebuild the container to apply changes:
```bash
docker-compose down
docker-compose up --build -d
```

### Replacing Placeholder Images

1. Place your images in `public/images/` directory
2. Update the `image` field in `projects.json` to match your filenames
3. Recommended image sizes:
   - Project cards: 800x600px (4:3 aspect ratio)
   - Project detail: 1200x800px or larger
4. Supported formats: JPG, PNG, WebP

5. Rebuild container:
```bash
docker-compose down
docker-compose up --build -d
```

### Updating Resume

Edit `public/resume.html` directly to update:
- Work experience
- Education
- Skills
- Certifications
- Contact information

Rebuild after changes:
```bash
docker-compose down
docker-compose up --build -d
```

## Docker Compose Configuration

The `docker-compose.yml` includes:

- **Port Mapping**: Host `3131` → Container `3131`
- **Read-Only Mount**: `./public` mounted read-only for security
- **Environment Variables**: `NODE_ENV=production`, `PORT=3131`
- **Restart Policy**: `always` (automatically restarts on failure)
- **Healthcheck**: Checks server availability every 30s
- **Network**: Isolated `frontend` network

### Healthcheck

The healthcheck uses `wget` to verify the server is responding:
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3131/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

Check health status:
```bash
docker-compose ps
# or
docker inspect portfolio-website | grep -A 10 Health
```

## Development Workflow

### Container-First Iteration

Since the `public/` directory is mounted read-only by default, changes to public files require rebuilding:

1. Edit files locally in `public/` directory
2. Rebuild and restart:
```bash
docker-compose down
docker-compose up --build -d
```

### Alternative: Writable Mount for Development

For faster iteration during development, you can temporarily make the volume writable:

1. Modify `docker-compose.yml`:
```yaml
volumes:
  - ./public:/app/public:rw  # Change :ro to :rw
```

2. Restart container:
```bash
docker-compose restart
```

Changes to HTML, CSS, and JS will now be reflected immediately (refresh browser).

**Note**: Changes to `server.js`, `package.json`, or `Dockerfile` always require rebuild.

### Using Nodemon for Hot Reload (Optional)

For active development, create a separate `Dockerfile.dev`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3131
ENV NODE_ENV=development
CMD ["npx", "nodemon", "server.js"]
```

Update `docker-compose.yml` to use the dev Dockerfile and writable volumes:
```yaml
build:
  context: .
  dockerfile: Dockerfile.dev
volumes:
  - ./public:/app/public:rw
  - ./server.js:/app/server.js:rw
```

## npm Scripts

The following scripts are available (run inside Docker):

```bash
npm start              # Start production server
npm run docker-build   # Build Docker image
npm run docker-run     # Run container (foreground)
npm run docker-run-detached  # Run container (background)
npm run compose-up     # Start with docker-compose
npm run compose-down   # Stop docker-compose
npm run logs           # View docker-compose logs
```

## Production Deployment

### Environment Variables

Set these for production:
- `NODE_ENV=production` (default)
- `PORT=3131` (default)

### Security Considerations

1. The `public/` directory is mounted read-only in production
2. Container runs as non-root user (node:20-alpine default)
3. No unnecessary dependencies installed (production mode)
4. Healthcheck ensures container restarts on failure

### Reverse Proxy Setup

For production with HTTPS, use Nginx or Traefik:

**Nginx example**:
```nginx
server {
    listen 80;
    server_name kimberlymiranda.us;
    
    location / {
        proxy_pass http://localhost:3131;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs

# Verify port is available
netstat -an | grep 3131  # Windows
lsof -i :3131            # macOS/Linux
```

### Changes not reflecting
```bash
# Ensure you rebuilt after changes
docker-compose down
docker-compose up --build -d

# Check if volume mount is correct
docker inspect portfolio-website | grep Mounts -A 20
```

### Healthcheck failing
```bash
# Check if server is responding
curl http://localhost:3131

# View detailed health status
docker inspect portfolio-website | grep -A 10 Health
```

## License

MIT License - feel free to use this template for your own portfolio.

## Credits

Built with:
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker](https://www.docker.com/)
- [Google Fonts](https://fonts.google.com/) (Inter, Space Grotesk)
