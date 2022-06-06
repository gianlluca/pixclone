# builder image
FROM golang:1.18-alpine3.15 as backend-builder

RUN mkdir /app
ADD . /app
WORKDIR /app

# RUN go clean --modcache
# RUN go mod download
RUN go mod vendor

RUN go build .

# production image
FROM alpine:latest
# RUN apk --no-cache add ca-certificates
# RUN apk add --no-cache git make musl-dev go
COPY --from=backend-builder /app/pixclone-backend ./

# configure Go
# ENV GOROOT /usr/lib/go
# ENV GOPATH /go
# ENV PATH /go/bin:$PATH

# RUN mkdir -p ${GOPATH}/src ${GOPATH}/bin
CMD ["./pixclone-backend"]