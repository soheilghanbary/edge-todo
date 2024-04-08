// import { app } from "@/server"
import { app } from "@/backend/server"
import { handle } from "hono/vercel"

export const runtime = "edge"
// Hono
export const GET = handle(app)
export const POST = handle(app)
export const DELETE = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)

// Elysia
// export const GET = app.handle
// export const POST = app.handle
// export const DELETE = app.handle
// export const PUT = app.handle
// export const PATCH = app.handle
