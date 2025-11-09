import { html } from 'hono/html';
import { getTodos, getDoneTodos, getTodosCount, getDoneTodosCount } from "./db.js";

export function renderTodos(filter) {
  // const rows = db.query('SELECT id, title, done FROM todos').all();
  const rows = filter === 'done' ? getDoneTodos() : getTodos()
  const total = getTodosCount()
  const done = getDoneTodosCount()
  return html`
    <ul id="todo-list">
      ${rows.map((t) => html`
      <li>
          <input type="checkbox" ${t.done===0?"":"checked"}
            data-on:click="@post('/api/toggle/${t.id}?filter=${filter}')"
          ></input>${t.title}
      </li>
      `)}
    </ul>
    <p>${done} of ${total} items done</p>
  `;
}
