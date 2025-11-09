// server.js
import Database from 'bun:sqlite';

import { Hono } from 'hono';
import { html } from 'hono/html';
import { serveStatic } from "hono/bun"; // use `serve-static` for Node

import { getTodos, addTodo, toggleTodo } from "./db.js";

const app = new Hono();

// Static files
app.use("/public/*", serveStatic({ root: "./" }));

// init sqlite
// const db = new Database('todos.db');
// db.run('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, title TEXT)');

// helper to render list HTML
function renderTodos() {
  // const rows = db.query('SELECT id, title, done FROM todos').all();
  const rows = getTodos()
  return html`
    <ul id="todo-list">
      ${rows.map((t) => html`
      <li>
          <input type="checkbox" ${t.done===0?"":"checked"}
            data-on:click="@post('/api/toggle/${t.id}')"
          ></input>${t.title}
      </li>
      `)}
    </ul>
  `;
}

app.get('/', (c) => {
  return c.html(html`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Datastar + Hono</title>
        <link rel="stylesheet" href="/public/styles.css"
      </head>
      <body>
        <form
          data-on:submit="@post('/addTodo', {contentType: 'form'})" >
          <input name="title" placeholder="New todo..." required />
          <button>Submit</button>
        </form>

        ${renderTodos()}

        <script type="module">
          import "https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.6/bundles/datastar.js";

        </script>
      </body>
    </html>
  `);
});

app.post('/addTodo', async (c) => {
  const body = await c.req.parseBody();
  const title = body.title?.trim();
  // if (title) db.run('INSERT INTO todos (title) VALUES (?)', [title]);
  if (title) addTodo(title)

  // return only the updated HTML fragment (partial)
  return c.html(renderTodos());
});

app.post("/api/toggle/:id", (c) => {
  toggleTodo(c.req.param("id"));

  // return c.json({ ok: true });
  return c.html(renderTodos());
});

export default app;

