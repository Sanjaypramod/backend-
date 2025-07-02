const express = require('express');
const mysql = require('mysql2');
const AWS = require('aws-sdk');
const app = express();
const port = process.env.PORT || 3000;

// AWS Secrets Manager client configuration
const secretsManager = new AWS.SecretsManager({
  region: 'us-east-1', // Change to your AWS region
});

// Function to retrieve the database credentials from AWS Secrets Manager
async function getRdsCredentials() {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: 'rds-credentials' }).promise();
    if (data.SecretString) {
      return JSON.parse(data.SecretString);
    }
    throw new Error('Unable to retrieve RDS credentials');
  } catch (error) {
    console.error('Error retrieving RDS credentials:', error);
    throw error;
  }
}

// Create a connection to the database using the credentials
async function connectToDb() {
  const credentials = await getRdsCredentials();
  const db = mysql.createConnection({
    host: credentials.host,
    user: credentials.username,
    password: credentials.password,
    database: credentials.dbname,
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err.stack);
      return;
    }
    console.log('Connected to MySQL');
  });

  return db;
}

// Sample API route
app.get('/data', async (req, res) => {
  const db = await connectToDb();
  db.query('SELECT * FROM users', (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving data from database');
      return;
    }
    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
