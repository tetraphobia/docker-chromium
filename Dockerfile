FROM ghcr.io/linuxserver/baseimage-kasmvnc:alpine318

# set version label
ARG BUILD_DATE
ARG VERSION
LABEL build_version="Linuxserver.io version:- ${VERSION} Build-date:- ${BUILD_DATE}"
LABEL maintainer="thelamer"

# title
ENV TITLE=Chromium
ENV UIVISION_VERSION=v8.3.9

# install chromium
RUN apk add --no-cache \
    chromium curl unzip

# install extension
WORKDIR /tmp/uivision
RUN curl -O https://download.ui.vision/archive/uiv-rpa-chrome-${UIVISION_VERSION}.zip && \
  mkdir -p /uiv && \
  unzip uiv-rpa-chrome-${UIVISION_VERSION}.zip -d /uiv

# cleanup
RUN rm -rf /tmp/*
WORKDIR /

# add local files
COPY /root /

# ports and volumes
EXPOSE 3000
