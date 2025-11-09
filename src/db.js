// db.js
import { Database } from "bun:sqlite";

const db = new Database("todos.db");

db.run(`
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  done INTEGER DEFAULT 0
);
`);

export function getTodos() {
  // return db.query("SELECT * FROM todos ORDER BY id DESC").all();
  return db.query("SELECT * FROM todos ORDER BY id").all();
}

export function addTodo(title) {
  db.query("INSERT INTO todos (title) VALUES (?)").run(title);
}

export function toggleTodo(id) {
  db.query("UPDATE todos SET done = NOT done WHERE id = ?").run(id);
}

