FROM node:18-alpine

# Install system dependencies for file processing
RUN apk add --no-cache \
    ffmpeg \
    ghostscript \
    libreoffice \
    python3 \
    py3-pip \
    fontconfig \
    ttf-dejavu

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads outputs logs

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
