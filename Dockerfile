# Copy the application code into the container
COPY . /app

# Set the working directory to the location of the app
WORKDIR /app

# Install dependencies
RUN npm install

# Expose the port
EXPOSE 3000

# Command to run the app
CMD ["node", "server.js"]
