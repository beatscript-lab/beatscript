FROM node:22-alpine
WORKDIR /app
COPY server.mjs install-runtimes.mjs ./
ENV NODE_ENV=production
USER node
EXPOSE 8080
CMD ["node", "server.mjs"]
