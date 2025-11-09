import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { db } from './db';
import { jsx } from 'hono/jsx';
import { raw } from 'hono/dist/helper/html';

const app = new Hono();

app.use('/favicon.ico', serveStatic({ path: './public/favicon.ico' }));

const todos = {
  all: () => db.query('SELECT * FROM todos').all(),
  create: (title) => db.query('INSERT INTO todos (title) VALUES (?)').run(title),
  update: (id, completed) => db.query('UPDATE todos SET completed = ? WHERE id = ?').run(completed, id),
  delete: (id) => db.query('DELETE FROM todos WHERE id = ?').run(id),
};

const App = () => (
  <html lang='en'>
    <head>
      <meta charset='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <title>Todo App</title>
      <script src='https://cdn.jsdelivr.net/npm/datastar@1.0.0-RC.6/dist/datastar.min.js'></script>
      <link
        rel='stylesheet'
        href='https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css'
      />
      <script>
        {raw`
          window.todos = {
            all: () => fetch('/todos').then(res => res.json()),
            create: (title) => fetch('/todos', { method: 'POST', body: JSON.stringify({ title }) }).then(res => res.json()),
            update: (id, completed) => fetch(\`/todos/\${id}\`, { method: 'PUT', body: JSON.stringify({ completed }) }),
            delete: (id) => fetch(\`/todos/\${id}\`, { method: 'DELETE' }),
          }
        `}
      </script>
    </head>
    <body>
      <main class='container' data-store='{ "todos": [] }' data-on-load='todos.all().then(data => merge({ todos: data }))'>
        <h1>Todo App</h1>
        <form data-on-submit-prevent='todos.create($el.title.value).then(data => merge({ todos: [...todos, data] })); $el.reset()'>
          <input type='text' name='title' placeholder='New todo' required />
          <button type='submit'>Add</button>
        </form>
        <ul>
          <template data-for='todo in todos'>
            <li>
              <input
                type='checkbox'
                data-checked='todo.completed'
                data-on-change='todos.update(todo.id, $el.checked)'
              />
              <span data-text='todo.title'></span>
              <button data-on-click='todos.delete(todo.id).then(() => { todos = todos.filter(t => t.id !== todo.id) })'>
                Delete
              </button>
            </li>
          </template>
        </ul>
      </main>
    </body>
  </html>
);

app.get('/', (c) => {
  return c.html(<App />);
});

app.get('/todos', (c) => {
  return c.json(todos.all());
});

app.post('/todos', async (c) => {
  const { title } = await c.req.json();
  const result = todos.create(title);
  const id = result.lastInsertRowid;
  return c.json({ id, title, completed: 0 });
});

app.put('/todos/:id', async (c) => {
  const { id } = c.req.param();
  const { completed } = await c.req.json();
  todos.update(id, completed ? 1 : 0);
  return c.body(null, 204);
});

app.delete('/todos/:id', (c) => {
  const { id } = c.req.param();
  todos.delete(id);
  return c.body(null, 204);
});

export default app;
