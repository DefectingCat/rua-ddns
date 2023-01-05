# Install dependencies only when needed
FROM node:lts-alpine AS deps
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update --no-cache \
    && apk upgrade --no-cache \
    && apk add --no-cache libc6-compat \
    && yarn config set registry https://registry.npmmirror.com 
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


# Rebuild the source code only when needed
FROM node:lts-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN apk update --no-cache \
    && apk upgrade --no-cache \
    && yarn config set registry https://registry.npmmirror.com \
    && yarn build


# Production image, copy all the files and run next
FROM node:lts-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
COPY package.json yarn.lock ./
COPY .env ./ 
COPY --from=builder /app/build ./
RUN yarn install --prod

EXPOSE 4000
EXPOSE 3999

ENV PORT 4000
ENV PORT 3999

CMD ["node", "main.js"]