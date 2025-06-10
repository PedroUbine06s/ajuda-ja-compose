# Base image
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy dependency definition files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# --- Add the entrypoint script ---
# Copy the entrypoint script into the container
COPY entrypoint.sh .
# Make the entrypoint script executable
RUN chmod +x ./entrypoint.sh

# Build the application
RUN pnpm run build

# Expose the application port
EXPOSE 3000

# Set the entrypoint to our script
ENTRYPOINT ["./entrypoint.sh"]

# The command that the entrypoint will execute after finishing.
# This is your original CMD.
CMD ["node", "dist/main.js"]