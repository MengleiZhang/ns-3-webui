import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import { ResizableEditor } from "@/components/resizable-editor";

export default async function Editor({ searchParams }) {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  return (
    <div>
      <Nav>{user.username}</Nav>
      <main className="gap-4 p-4 md:gap-8 md:p-8">
        <ResizableEditor scenario={searchParams.scenario}>
          {user.username}
        </ResizableEditor>
      </main>
    </div>
  );
}
