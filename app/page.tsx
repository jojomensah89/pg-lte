"use client"
import { useTodos } from "@/hooks/use-todos";


// interface Todo {
//   id: string;
//   task?: string;
//   done?: boolean;
// }

export default  function Home() {
  

const {todos} = useTodos();
  
  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex flex-col">
        {(todos?.rows && todos.rows.length > 0) ? (
          todos?.rows?.map((todo) => (
            <div key={String(todo.id)} className="flex flex-row items-center justify-between p-4">
              {String(todo.task)}
            </div>
          ))
        ) : (
          <div className="p-4 text-center">
            <p className="text-red-500">Database connection issue or no users found.</p>
            <p className="text-sm mt-2">{todos?.totalCount}</p>
          </div>
        )}
      </div>
    </div>
  );
}
