FROM node:18-bullseye

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

RUN dpkg --add-architecture i386 && \
  apt-get update && \
  apt-get install -y --no-install-recommends \
  software-properties-common && \
  apt-add-repository non-free && \
  apt-add-repository contrib && \
  apt-get update && \
  apt-get install -y --no-install-recommends \
  wine32 wine64 fakeroot libxtst-dev libpng-dev

# Install dependencies required for native modules like robotjs
RUN apt-get update && apt-get install -y \
  libxext-dev \
  dpkg \
  fakeroot \
  rpm \
  libxtst-dev \
  libx11-dev \
  libpng-dev \
  make \
  gcc \
  wine \
  wine32 \
  g++ \
  && rm -rf /var/lib/apt/lists/*

# Install Node.js dependencies
# RUN npm install

# Run the build process
# RUN npm run build:win

# Copy built files to the desired location passed as a parameter
CMD ["sh", "-c", "cp -r dist/* $EXPORT_PATH && echo Build process completed! && tail -f /dev/null"]
