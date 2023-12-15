FROM ubuntu:jammy as build
ENV UIVISION_VERSION=v8.3.9

RUN apt-get update && \
  apt-get install -y \
  curl unzip

# extract extension
WORKDIR /build/uivision
RUN curl -O https://download.ui.vision/archive/uiv-rpa-chrome-${UIVISION_VERSION}.zip && \
  mkdir -p uivision && \
  unzip uiv-rpa-chrome-${UIVISION_VERSION}.zip -d uivision
  
FROM ghcr.io/linuxserver/baseimage-kasmvnc:ubuntujammy

# set version label
ARG BUILD_DATE
ARG VERSION
LABEL build_version="Linuxserver.io version:- ${VERSION} Build-date:- ${BUILD_DATE}"

# title
ENV TITLE=UI.Vision

# install chromium and pyxdg
RUN apt-get update && \
  apt-get install -y \
  python3-xdg
WORKDIR /tmp/chrome
RUN curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
  apt-get install -y ./google-chrome-stable_current_amd64.deb

# add local files
COPY /root /

# add uivision and xmodules
COPY --from=build /build/uivision/uivision /uivision

WORKDIR /html

# cleanup
RUN rm -rf /tmp/*
RUN apt-get clean && \
  apt-get autoremove --yes

# ports and volumes
EXPOSE 3000
