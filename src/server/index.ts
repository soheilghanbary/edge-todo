import { db } from "@/backend/db"
import { TodoTable } from "@/backend/db/schema"
import { desc, eq } from "drizzle-orm"
import { Elysia } from "elysia"

export const app = new Elysia({ prefix: "/api" }).compile()

// get all todos
app.get("/todos", async (c) => {
  const todos = await db
    .select()
    .from(TodoTable)
    .orderBy(desc(TodoTable.createdAt))
  return todos
})

// create new todo
app.post("/todos", async (c) => {
  const { text } = await c.request.json()
  const newTodo = await db
    .insert(TodoTable)
    .values({ text })
    .returning({ id: TodoTable.id, text: TodoTable.text, done: TodoTable.done })
  return newTodo[0]
})

// delete todo by id
app.delete("/todos/:id", async ({ params: { id } }) => {
  const deleted = await db
    .delete(TodoTable)
    .where(eq(TodoTable.id, parseInt(id)))
  return { msg: "todo has been deleted" }
})

// clear all todos
app.delete("/todos", async (c) => {
  const deleted = await db.delete(TodoTable)
  return { msg: "todos has been cleared" }
})

// done todo
app.patch("/todos/:id", async ({ params: { id }, request }) => {
  const { done } = await request.json()
  const updated = await db
    .update(TodoTable)
    .set({ done })
    .where(eq(TodoTable.id, parseInt(id)))
    .returning({ id: TodoTable.id, text: TodoTable.text, done: TodoTable.done })
  return { msg: "todo was updated" }
})
