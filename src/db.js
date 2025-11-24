// db.js
import { Database } from "bun:sqlite";

const db = new Database("app.db");

db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS TBL_NAME ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL
  );
`);

db.run(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_first_last_name 
  on tbl_name ( first_name, last_name)
`);

let stmt_name = db.prepare(`
  insert or ignore into TBL_NAME (first_name, last_name) values (?, ?)
`)

stmt_name.run("Abagail", "Bradtke");
stmt_name.run("Beau", "Wyman");
stmt_name.run("Brandon", "Adams");

db.run(`
  CREATE TABLE IF NOT EXISTS TBL_USER ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    email TEXT NOT NULL,
    status INTEGER DEFAULT 0
  );
`);

let stmt_user = db.prepare(`
  insert or ignore into TBL_USER (name, email) values (?, ?)
`)

stmt_user.run("Joe Smith", "joe@smith.org");
stmt_user.run("Angie MacDowell", "angie@macdowell.org");
stmt_user.run("Fuqua Tarkenton", "fuqua@tarkenton.org");
stmt_user.run("Kim Yee", "kim@yee.org");

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

export function getDoneTodos() {
  return db.query("SELECT * FROM todos WHERE done = 1 ORDER BY id").all();
}

export function getTodosCount() {
  return db.query("SELECT COUNT(*) as count FROM todos").get().count;
}

export function getDoneTodosCount() {
  return db.query("SELECT COUNT(*) as count FROM todos WHERE done = 1").get().count;
}

export function getNames() {
  return db.query("SELECT first_name, last_name FROM TBL_NAME ORDER BY id").all();
}

export function getFilterNames(search) {
  stmt_user = db.prepare("SELECT * FROM TBL_NAME where first_name like ?")
  return stmt_user.all(`${search}%`)
}

export function getUsers() {
  return db.query("SELECT * FROM TBL_USER ORDER BY id").all();
}

export function updateStatus(selection){
  for ( let i=0; i < selection.length; i++){
    const id = i + 1;
    const status = selection[i] ? 1 : 0

    db.run(
      `update tbl_user set status = ? where id = ?`,
      status,
      id
    );
  }
}
