# Use an official Node runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json ./
COPY yarn.lock ./

# Install the application dependencies
RUN yarn install

# Copy the application code to the working directory
COPY . .

# The application listens on port 3000, so expose this port
EXPOSE 3000

# The command to run the application
CMD ["yarn", "start:prod"]