import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";

import Link from "next/link";
import SimulationTable from "@/components/simulation-table";

export default async function DashboardPage() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  return (
    <div>
      <Nav>{user.username}</Nav>
      <main className="gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="mb-4">Dashboard</h1>
        <SimulationTable>{user.username}</SimulationTable>
        <div className="text-sm">
          Crate a new{" "}
          <Link href="/simulation" className="underline">
            simulation
          </Link>
        </div>
      </main>
    </div>
  );
}
