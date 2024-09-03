const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Initialize SQLite database connection
const db = new sqlite3.Database('database.db');

// User schema (for reference, not used by SQLite directly)
const UserSchema = {
  username: String,
  password: String,
  idCard: String,
  licence: String,
  role: String,
  personId: String,
  status: String
};

// Function to hash passwords
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Save user with hashed password
const saveUser = async (username, password, idCard, licence, role, personId, status) => {
  const hashedPassword = await hashPassword(password);
  db.run('INSERT INTO users (username, password, idCard, licence, role, personId, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [username, hashedPassword, idCard, licence, role, personId, status]);
};

// Update user status to 'inactive'
const markInactive = async (username) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE users SET status = ? WHERE username = ?', ['inactive', username], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ message: 'User status updated to inactive', changes: this.changes });
      }
    });
  });
};

// General function to update user information
const updateUser = async (username, updates) => {
  const { password, idCard, licence, role } = updates;
  
  // Handle password hashing if password is to be updated
  let hashedPassword;
  if (password) {
    hashedPassword = await hashPassword(password);
  }
  
  return new Promise((resolve, reject) => {
    const queryParts = [];
    const params = [];

    if (password) {
      queryParts.push('password = ?');
      params.push(hashedPassword);
    }
    if (idCard) {
      queryParts.push('idCard = ?');
      params.push(idCard);
    }
    if (licence) {
      queryParts.push('licence = ?');
      params.push(licence);
    }
    if (role) {
      queryParts.push('role = ?');
      params.push(role);
    }

    const query = `UPDATE users SET ${queryParts.join(', ')} WHERE username = ?`;
    params.push(username);

    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ message: 'User updated successfully', changes: this.changes });
      }
    });
  });
};

module.exports = {
  UserSchema,
  saveUser,
  markInactive,
  updateUser
};