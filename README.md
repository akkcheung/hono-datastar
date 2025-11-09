#  Datastar + Hono + Bun Todo App

A lightweight **Todo List** demo built with:

-  [Datastar](https://github.com/starfederation/datastar) – progressive, declarative HTML updates  
-  [Hono](https://hono.dev) – fast web framework for Bun/Edge runtimes  
-  [Bun](https://bun.sh) – modern all-in-one JavaScript runtime  
-  SQLite (via `bun:sqlite`) – persistent local database  

This project demonstrates **progressive enhancement**:  
works normally without JavaScript, and enhances automatically when Datastar loads.

---

## Project Structure


---

##  Running in Development

Install dependencies and start the app:

```bash
bun install
bun run dev

## Building for Production

'''bash
bun run build

Or 

'''bash
bun build src/server.js --compile --outfile dist/app

## License
MIT 2025 - Example educational project
