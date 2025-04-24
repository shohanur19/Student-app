const express = require('express');
const cors = require('cors');
const pool = require('./db'); // PostgreSQL connection pool
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json()); // For parsing JSON data

// Route to register a new student (unchanged)
app.post('/api/register', async (req, res) => {
  const { full_name, roll_number, session, year, password } = req.body;

  if (!full_name || !roll_number || !session || !year || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert student data into the database without password hashing
    const result = await pool.query(
      'INSERT INTO students (full_name, roll_number, session, year, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [full_name, roll_number, session, year, password]
    );
    res.status(201).json(result.rows[0]);  // Return the inserted student data
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Route to login student (verify password)
app.post('/api/login', async (req, res) => {
  const { roll_number, password } = req.body;

  if (!roll_number || !password) {
    return res.status(400).json({ error: 'Roll number and password are required' });
  }

  try {
    // Fetch student by roll number
    const result = await pool.query('SELECT * FROM students WHERE roll_number = $1', [roll_number]);

    if (result.rows.length > 0) {
      const student = result.rows[0];

      // Compare entered password with the stored password
      if (password === student.password) {
        delete student.password; // Exclude password from response
        res.json(student);
      } else {
        res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Route to search student by roll number
app.get('/api/students/:roll', async (req, res) => {
  const { roll } = req.params;

  try {
    const result = await pool.query('SELECT * FROM students WHERE roll_number = $1', [roll]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Return student data if found
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
