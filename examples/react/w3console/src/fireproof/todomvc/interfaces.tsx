export interface ListLoaderData {
  list: ListDoc
  todos: TodoDoc[]
}

interface Doc {
  _id: string
}

export interface TodoDoc extends Doc {
  completed: boolean
  title: string
  listId: string
  type: 'todo'
}
export interface ListDoc extends Doc {
  title: string
  type: 'list'
}
