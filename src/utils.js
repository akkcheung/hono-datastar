import { html } from 'hono/html';
import { getTodos, getDoneTodos, getTodosCount, getDoneTodosCount } from "./db.js";

export function renderTodos(filter) {
  // const rows = db.query('SELECT id, title, done FROM todos').all();
  const rows = filter === 'done' ? getDoneTodos() : getTodos()
  return html`
    <div id="todo-list">
      <ul>
        ${rows.map((t) => html`
            <li><input type="checkbox" ${t.done===0?"":"checked"} data-on:click="@post('/api/toggle/${t.id}?filter=${filter}')"></input>${t.title}</li>
        `)}
      </ul>
    </div>
  `;
}

export function renderCounts() {
  const total = getTodosCount()
  const done = getDoneTodosCount()
  return html`
    <div id="count">
      <p>${done} of ${total} items done</p>
    </div>
  `;
}

export function renderListAndCounts(filter) {
  return html`
    ${renderTodos(filter)}
    ${renderCounts()}
  `;
}
