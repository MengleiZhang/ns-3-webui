import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Page() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return redirect("/dashboard");
}
