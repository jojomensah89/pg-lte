
import { getUsers } from "@/db/query/users";
// import { getPosts } from "@/db/query/posts";

export default async function Home() {
let users: {id:number; userName?: string; role?: string }[] = [];
  
  try {
    users = (await getUsers()).map(user => ({
      id: user.id,
      userName: user.userName || undefined,
      role: user.role || undefined
    }));
    console.log("Users:", users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    // Continue with empty users array
  }
  
  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex flex-col">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={index} className="flex flex-row items-center justify-between p-4">
              {user.userName} - {user.role || 'No role'}
            </div>
          ))
        ) : (
          <div className="p-4 text-center">
            <p className="text-red-500">Database connection issue or no users found.</p>
            <p className="text-sm mt-2">Please check your database configuration.</p>
          </div>
        )}
      </div>
    </div>
  );
}
