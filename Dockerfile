FROM node:22 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=optional
RUN npm install @tailwindcss/oxide-linux-x64-gnu

FROM node:22 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN if [ -f env.dev ]; then cp env.dev .env; elif [ -f .env.dev ]; then cp .env.dev .env; fi
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]
