FROM oven/bun:latest

COPY . /app
WORKDIR /app

RUN bun i
RUN bun run build

ENTRYPOINT ["bun", "run" ]
CMD ["start"]
EXPOSE 3000
