FROM oven/bun:1 AS build

WORKDIR /app
COPY ./package.json ./bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /app
COPY ./entrypoint.sh ./entrypoint.sh
EXPOSE 80
CMD ["./entrypoint.sh"]
