"use client"
import { Icons } from "@components/extras/icons"
import { getCurrentDate } from "@lib/functions/current-date"
import { useDeleteTodo, useDoneTodo, useTodos } from "@lib/hooks/use-todos"
import { cn } from "@lib/utils"
import { Button } from "@ui/button"
import { Skeleton } from "@ui/skeleton"

const TodoLoader = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full rounded-md bg-muted/50 shadow-sm" />
      <Skeleton className="h-12 w-full rounded-md bg-muted/50 shadow-sm" />
      <Skeleton className="h-12 w-full rounded-md bg-muted/50 shadow-sm" />
      <Skeleton className="h-12 w-full rounded-md bg-muted/50 shadow-sm" />
    </div>
  )
}

export const TodoList = () => {
  const { data, isLoading } = useTodos()
  if (isLoading) return <TodoLoader />
  return (
    <div className="space-y-4">
      {data?.map((todo) => <TodoItem key={todo.id} {...todo} />)}
    </div>
  )
}

const TodoItem = (todo: any) => {
  const { mutateAsync: deleteMutate, isPending } = useDeleteTodo()
  const { mutateAsync: doneMKutate, isPending: isDonePending } = useDoneTodo()
  return (
    <div
      key={todo.id}
      className="flex items-center justify-between gap-2 rounded-md border p-4 shadow-sm"
    >
      <div className="grow space-y-0.5">
        <h2 className={cn("font-medium", { "line-through": todo.done })}>
          {todo.text}
        </h2>
        <p className="text-xs text-muted-foreground md:text-sm">
          {getCurrentDate(todo.createdAt)}
        </p>
      </div>
      <Button
        onClick={async () =>
          await doneMKutate({ id: todo.id, done: !todo.done })
        }
        disabled={isDonePending}
        variant={"outline"}
        size={"icon"}
      >
        <Icons.check className="size-4" />
      </Button>
      <Button
        onClick={async () => await deleteMutate(todo.id)}
        disabled={isPending}
        variant={"outline"}
        size={"icon"}
      >
        <Icons.trash className="size-4 text-rose-600" />
      </Button>
    </div>
  )
}
