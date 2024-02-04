FROM node:16.20.2

WORKDIR /usr/src/app

# Set environment to production
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire project
COPY . .

EXPOSE 3030

# Build project
CMD ["node", "./dist/listen.js"]
