# Stage 1: Build the application
FROM node:20-alpine3.19@sha256:f28ec01ebb46af85d5a5c02f59296ccc494386da07d0a447a1b9f58fc8642167 AS build

# Reduce npm spam when installing within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
 
# Disable color when run inside Docker
ENV NPM_CONFIG_COLOR=false

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all files and build the application
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine3.19@sha256:208ae3c180b7d26f6a8046fac4c8468b2ab8bd92123ab73f9c5ad0f6f1c5543d 

# Copy the build output to Nginx's default public directory
COPY --from=build /app/out /usr/share/nginx/html

# Expose port 80
EXPOSE 80