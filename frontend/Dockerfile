FROM node:22-alpine AS build-stage

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

# FROM nginx:alpine AS production-stage

# COPY --from=build-stage /src/dist /usr/share/nginx/html

EXPOSE 8080

# CMD ["nginx", "-g", "daemon off;"]

# CMD ["npm", "run", "build", "&&", "npm", "run", "dev"]
CMD ["npm", "run", "dev"]
