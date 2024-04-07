import { desc, eq } from "drizzle-orm"
import { Hono } from "hono"
import { db } from "./db"
import { TodoTable } from "./db/schema"

export const app = new Hono().basePath("/api")

// get all todos
app.get("/todos", async (c) => {
  const todos = await db
    .select()
    .from(TodoTable)
    .orderBy(desc(TodoTable.createdAt))
  return c.json(todos)
})

// create new todo
app.post("/todos", async (c) => {
  const { text } = await c.req.json()
  const newTodo = await db
    .insert(TodoTable)
    .values({ text })
    .returning({ id: TodoTable.id, text: TodoTable.text, done: TodoTable.done })
  return c.json(newTodo)
})

// delete todo by id
app.delete("/todos/:id", async (c) => {
  const id = await c.req.param("id")
  const deleted = await db
    .delete(TodoTable)
    .where(eq(TodoTable.id, parseInt(id)))
  return c.json({ msg: "todo has been deleted" })
})

// clear all todos
app.delete("/todos", async (c) => {
  const deleted = await db.delete(TodoTable).where(eq(TodoTable.done, false))
  return c.json({ msg: "todos has been cleared" })
})

// done todo
app.patch("/todos/:id", async (c) => {
  const id = await c.req.param("id")
  const { done } = await c.req.json()
  const updated = await db
    .update(TodoTable)
    .set({ done })
    .where(eq(TodoTable.id, parseInt(id)))
    .returning({ id: TodoTable.id, text: TodoTable.text, done: TodoTable.done })
  return c.json(updated)
})
