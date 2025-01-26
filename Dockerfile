FROM electronuserland/builder:wine

# Set environment variables
ARG GIT_REPO
ARG EXPORT_PATH

WORKDIR /app

# Enable SSH for cloning the repository
RUN mkdir -p ~/.ssh && \
  chmod 700 ~/.ssh && \
  ssh-keyscan github.com >> ~/.ssh/known_hosts

# Clone the repository
RUN --mount=type=ssh \
  if [ -d "/app/.git" ]; then \
  cd /app && git pull; \
  else \
  git clone --depth 1 "$GIT_REPO" /app; \
  fi



# Install dependencies required for native modules like robotjs
RUN apt-get update && apt-get install -y \
  libxtst-dev \
  libpng++-dev \
  make gcc


# Copy built files to the desired location passed as a parameter
CMD ["sh", "-c", "cp -r dist/* $EXPORT_PATH && echo Build process completed! && tail -f /dev/null"]
