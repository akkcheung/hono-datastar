// server.js
import Database from 'bun:sqlite';

import { Hono } from 'hono';
import { html } from 'hono/html';
import { serveStatic } from "hono/bun"; // use `serve-static` for Node

import { stream } from 'hono/streaming'
import { layout } from './layout.js'


import { renderTodos, renderCounts, renderListAndCounts } from "./utils.js";
import { renderNames, renderBulkUpdate } from "./utils.js";
import { addTodo, toggleTodo } from "./db.js";

import { updateStatus } from "./db.js"

const app = new Hono();

// Static files
app.use("/public/*", serveStatic({ root: "./" }));

app.use('/sse/*', async (c, next) => {
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache');
  c.header('Connection', 'keep-alive');
  await next();
});

app.get('/sse', (c) => {
  return stream(c, async (stream) => {
    while (true) {
      await stream.write('event: datastar-patch-signals\n');
      await stream.write(`data: signals {time_stamp: '${new Date().toLocaleTimeString()}'}\n\n`);
      await stream.sleep(500)
    }
  })
});

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

        <div data-signals:time_stamp="''" data-init="@get('/sse')">
            <div data-text="$time_stamp"></div>
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

app.get('/examples/active_search', (c) => {
  return c.html(
    layout({
      title: "Active Search",
      body: ` 
        <input
            type="text"
            placeholder="Search..."
            data-bind:search
            data-on:input__debounce.200ms="@get('/examples/active_search/search')"
        />
      `
    })
    + `${renderNames('')}`
  )
});

app.get('/examples/active_search/search', (c) => {
  // console.log('/search')

  // const params = new URL(url).searchParams
  const encoded = c.req.query('datastar')
  const decoded = decodeURIComponent(encoded)

  const data = JSON.parse(decoded)
  console.log(data.search)

  return c.html(
    `${renderNames(data.search)}`
  )
});

app.get('/examples/bulk_update', (c) => {
  return c.html(
    layout({
      title: "Bulk Update",
      body: renderBulkUpdate()
    })
  )
})

app.put('/examples/bulk_update/', async (c) => {
  const { selections } = await c.req.json();

  updateStatus(selections)

  return c.html(
    renderBulkUpdate()
  )
})

export default app;





