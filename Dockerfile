
FROM  golang:1.19.4-bullseye AS gobuild

WORKDIR /app

COPY ./go.mod ./
RUN go mod download

COPY ./main.go ./
COPY ./version.go ./
COPY ./api/ ./api/
COPY ./utils/ ./utils/
RUN go build -o=arcarde-k43

FROM node:latest AS uibuild

WORKDIR /app

COPY ./ui/package.json ./
COPY ./ui/tsconfig.json ./
RUN npm install

COPY ./ui/fonts/ ./fonts
COPY ./ui/public/ ./public
COPY ./ui/src/ ./src
RUN npm run build

# Deploy
FROM debian:bullseye-slim
WORKDIR /opt/arcarde-k43
COPY --from=gobuild /app/arcarde-k43 ./
COPY --from=uibuild /app/build/ ./ui/build
COPY ./config/ ./config
EXPOSE 9090
ENTRYPOINT ["/opt/arcarde-k43/arcarde-k43"]


