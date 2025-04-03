import { getTodos } from "../_actions/todos";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function TodosPage() {
  let todos = [];
  try {
    todos = (await getTodos()).rows.map((todo: { id: string; task?: string; done?: boolean }) => ({
      id: todo.id,
      task: todo.task || undefined,
      done: todo.done || false
    }));
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    // Continue with empty todos array
  }
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Task Management
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Todos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">My Todos</h2>
            <div className="flex flex-col">
              {todos.length > 0 ? (
                todos.map((todo) => (
                  <div key={todo.id} className="flex flex-row items-center justify-between p-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={todo.done} 
                        readOnly 
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className={todo.done ? "line-through text-gray-500" : ""}>
                        {todo.task}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-gray-500">No todos found.</p>
                  <p className="text-sm mt-2">Add some todos to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}