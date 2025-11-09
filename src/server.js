// server.js
import Database from 'bun:sqlite';

import { Hono } from 'hono';
import { html } from 'hono/html';
import { serveStatic } from "hono/bun"; // use `serve-static` for Node

import { getTodos, addTodo, toggleTodo, getDoneTodos, getTodosCount, getDoneTodosCount } from "./db.js";
import { renderTodos, renderCounts, renderListAndCounts } from "./utils.js";

const app = new Hono();

// Static files
app.use("/public/*", serveStatic({ root: "./" }));

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
          data-on:submit="@post('/addTodo?filter=${c.req.query('filter')}', {contentType: 'form'})" >
          <input name="title" placeholder="New todo..." required />
          <button>Submit</button>
        </form>

        ${renderTodos()}
        ${renderCounts()}

        <div id="controls">
          <button data-on:click="@get('/todos?filter=done')">Show Done</button>
          <button data-on:click="@get('/todos')">Show All</button>
        </div>

        <script type="module">
          import "https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-RC.6/bundles/datastar.js";

        </script>
      </body>
    </html>
  `);
});

app.get('/todos', (c) => {
  const filter = c.req.query('filter')
  return c.html(renderListAndCounts(filter));
});

app.post('/addTodo', async (c) => {
  const filter = c.req.query('filter')
  const body = await c.req.parseBody();
  const title = body.title?.trim();
  // if (title) db.run('INSERT INTO todos (title) VALUES (?)', [title]);
  if (title) addTodo(title)

  // return only the updated HTML fragment (partial)
  return c.html(renderListAndCounts(filter));
});

app.post("/api/toggle/:id", (c) => {
  const filter = c.req.query('filter')
  toggleTodo(c.req.param("id"));

  // return c.json({ ok: true });
  return c.html(renderListAndCounts(filter));
});

export default app;

