import { signOut, auth } from "@/auth"

export default async function AdminDashboard() {
  const session = await auth()

  return (
    <div>
      <div>{session?.user.name}</div>
      <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
    </div>
    
  )
}