import { html } from 'hono/html';
import { getTodos, getDoneTodos, getTodosCount, getDoneTodosCount } from "./db.js";
import { getNames, getFilterNames } from "./db.js";
import { getUsers } from "./db.js"

export function renderTodos(filter) {
  // const rows = db.query('SELECT id, title, done FROM todos').all();
  const rows = filter === 'done' ? getDoneTodos() : getTodos()
  return html`
    <div id="todo-list">
      <ul>
        ${rows.map((t) => html`
            <li><input type="checkbox" ${t.done === 0 ? "" : "checked"} data-on:click="@post('/api/toggle/${t.id}?filter=${filter}')"></input>${t.title}</li>
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

export function renderNames(filter) {
  const rows = filter === '' ? getNames('') : getFilterNames(filter)
  // console.log(rows);

  return html`
    <div id="name-list">
      <ul>
        ${rows.map((r) => html`
            <li>${r.first_name}, ${r.last_name}</li>
        `)}
      </ul>
    </div>
  `;
}

export function renderBulkUpdate() {
  return html`
  <div
    id="demo"
    data-signals__ifmissing="{_fetching: false, selections: Array(4).fill(false)}">

    <table>
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              data-bind:_all
              data-on:change="$selections = Array(4).fill($_all)"
              data-effect="$selections; $_all = $selections.every(Boolean)"
              data-attr:disabled="$_fetching"
            />
          </th>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>

        <!--
        <tr>
          <td>
            <input
              type="checkbox"
              data-bind:selections
              data-attr:disabled="$_fetching" />
          </td>
          <td>Joe Smith</td>
          <td>joe@smith.org</td> 
          <td>Activate</td>
        </tr>
        -->

        ${renderUsers()}
      </tbody>

    </table>

    <div>
      <button
        data-on:click="@put('/examples/bulk_update/')"
        data-indicator:_fetching
        data-attr:disabled="$_fetching" >
        Toggle Status
      </button>
    </div>

  </div>
  `
}

export function renderUsers() {

  const rows = getUsers()
  return html`
    ${rows.map((r) => html`
      <tr>
        <td>
          <input
            type="checkbox"
            data-bind:selections
            data-attr:disabled="$_fetching" />
        </td>
        <td>${r.name}</td>
        <td>${r.email}</td>
        <td>${r.status === 1 ? 'Active':'Inactive' }</td>
      </tr>
      `
      )}
  `
}
