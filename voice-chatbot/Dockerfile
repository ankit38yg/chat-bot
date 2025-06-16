# ---- FRONTEND BUILD STAGE ----
FROM node:18 AS frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

# ---- BACKEND + SERVE BUILD OUTPUT ----
FROM node:18 AS backend
WORKDIR /app

# Copy backend code
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

# Copy frontend build into backend's public folder
COPY --from=frontend /app/client/dist ./public
COPY server .

# Set environment
ENV NODE_ENV=production
EXPOSE 5000

# Run backend
CMD ["node", "index.js"]
