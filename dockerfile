# Use Node.js 20-alpine with pnpm
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install pnpm globally
RUN corepack enable

# Copy only the package files first (leverage Docker cache)
COPY pnpm-lock.yaml package.json ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Expose the application port
EXPOSE 3000

# Command to run the app
CMD ["pnpm", "run", "start:prod"]
