FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build


FROM oven/bun:1

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/index.html ./src/index.html
COPY package.json bun.lock ./
RUN bun install --production

EXPOSE 3000

CMD ["bun", "src/index.tsx"]