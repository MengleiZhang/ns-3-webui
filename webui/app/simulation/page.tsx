import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import ExampleList from "@/components/example-list";
import Nav from "@/components/Nav";

export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return (
    <div>
      <Nav>{user.username}</Nav>
      <main className="gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="mb-4">Select a scenario to start the simulation:</h1>
        <ExampleList username={user.username} />
      </main>
    </div>
  );
}
