# Use an appropriate base image for your application
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and install dependencies first
COPY package.json /app/
RUN npm install

# Copy the rest of the application code into the container
COPY . /app

# Expose the necessary port
EXPOSE 3000

# Command to run the application
CMD ["node", "src/server.js"]
