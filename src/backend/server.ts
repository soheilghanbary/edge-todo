import { desc, eq } from "drizzle-orm"
import { Hono } from "hono"
import { db } from "./db"
import { TodoTable } from "./db/schema"

export const app = new Hono().basePath("/api")

// get all todos
app.get("/todos", async (c) => {
  const { filter } = c.req.query()
  switch (filter) {
    case "all":
      return c.json(
        await db.select().from(TodoTable).orderBy(desc(TodoTable.createdAt))
      )
    case "done":
      return c.json(
        await db.select().from(TodoTable).where(eq(TodoTable.done, true))
      )
    case "undone":
      return c.json(
        await db.select().from(TodoTable).where(eq(TodoTable.done, false))
      )
  }
})

// create new todo
app.post("/todos", async (c) => {
  const { text } = await c.req.json()
  const newTodo = await db
    .insert(TodoTable)
    .values({ text })
    .returning({ id: TodoTable.id, text: TodoTable.text, done: TodoTable.done })
  return c.json(newTodo[0])
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
  const deleted = await db.delete(TodoTable)
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
  return c.json({ msg: "todo was updated" })
})
