# Use Node.js 22 Alpine as the base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
# Using ci for clean install if lockfile exists, otherwise install
RUN npm ci || npm install

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm run build

# Prune dev dependencies to keep the image smaller (optional, but good practice)
# We need to ensure 'dependencies' contains all backend requirements
RUN npm prune --production

# Expose the port the app runs on
EXPOSE 3001

# Set environment variables (defaults, can be overridden)
ENV PORT=3001
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
