# Use Node.js 22 Alpine as the base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Define build arguments for Vite
ARG VITE_API_KEY
ARG VITE_API_ENDPOINT
ARG VITE_LOCAL_API_ENDPOINT
ARG VITE_BASE_URL

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci || npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
# Passing build args as environment variables to the build command
RUN VITE_API_KEY=${VITE_API_KEY} \
    VITE_API_ENDPOINT=${VITE_API_ENDPOINT} \
    VITE_LOCAL_API_ENDPOINT=${VITE_LOCAL_API_ENDPOINT} \
    VITE_BASE_URL=${VITE_BASE_URL} \
    npm run build

# Prune dev dependencies to keep the image smaller
RUN npm prune --production

# Expose the port the app runs on
EXPOSE 3001

# Set environment variables (defaults, can be overridden)
ENV PORT=3001
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
