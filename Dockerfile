
FROM  golang:1.19.4-bullseye AS gobuild

WORKDIR /app

COPY ./api/go.mod ./
RUN go mod download

COPY ./api/main.go ./
COPY ./api/v1/ ./v1
COPY ./api/utils/ ./utils

RUN go build -o ./arcade-k43 main.go

FROM node:19-bullseye-slim AS uibuild

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
WORKDIR /opt/arcade-k43
COPY --from=gobuild /app/arcade-k43 ./
COPY --from=uibuild /app/build/ ./ui/build
COPY ./api/config/ ./config
EXPOSE 9090
ENTRYPOINT ["/opt/arcade-k43/arcade-k43"]


