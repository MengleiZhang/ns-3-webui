"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, CircleStop, Trash2, FolderDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ns3ExecSync, serverExecSync } from "@/components/system-call";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SimulationStatus = {
  files: string[];
  status: string;
  loading: boolean;
  progress: number;
  scenario: string;
  name: string;
  username: string;
};

export const columns: ColumnDef<SimulationStatus>[] = [
  {
    accessorKey: "scenario",
    header: "Scenario",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "files",
    header: "Trace files",
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const simulationStatus = row.original;
      if (simulationStatus.loading) {
        return;
      }
      return (
        <div className="flex items-center space-x-2">
          {simulationStatus.status === "running" && (
            <span className="flex h-2 w-2 rounded-full bg-green-500" />
          )}
          <p>{simulationStatus.status}</p>
        </div>
      );
    },
  },
  {
    header: "Progress",
    cell: ({ row }) => {
      const simulationStatus = row.original;
      if (simulationStatus.loading) {
        return;
      }
      let progressPer = simulationStatus.progress;
      if (
        simulationStatus.status === "stopped" &&
        simulationStatus.progress == 0
      ) {
        progressPer = 100;
      }
      return (
        <div className="flex items-center space-x-2">
          <Progress value={progressPer} />
          <Label htmlFor="simulation-progress">{progressPer}%</Label>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const simulationStatus = row.original;
      const router = useRouter();
      if (simulationStatus.loading) {
        return;
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {simulationStatus.files.length > 0 && (
              <DropdownMenuItem
                onClick={async () => {
                  //remove old files and return current path
                  let currentPath = await serverExecSync(
                    "cd public; rm " + simulationStatus.username + "*; pwd"
                  );
                  currentPath = currentPath.toString().trim();
                  //console.log(currentPath);

                  const cmdLine =
                    "cd simulation_trace/" +
                    simulationStatus.username +
                    "/" +
                    simulationStatus.scenario +
                    "." +
                    simulationStatus.name +
                    "; zip " +
                    currentPath +
                    "/" +
                    simulationStatus.username +
                    "." +
                    simulationStatus.scenario +
                    "." +
                    simulationStatus.name +
                    ".zip *";
                  const output = await ns3ExecSync(cmdLine);
                  //console.log(cmdLine);
                  router.push(
                    simulationStatus.username +
                      "." +
                      simulationStatus.scenario +
                      "." +
                      simulationStatus.name +
                      ".zip"
                  );
                }}
              >
                <FolderDown className="mr-2 h-4 w-4" />
                Download trace files
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                let cmdLineString =
                  "kill -9 $(ps --ppid $(tail -n 1 simulation_trace/" +
                  simulationStatus.username +
                  "/" +
                  simulationStatus.scenario +
                  "." +
                  simulationStatus.name +
                  "/pid.txt) | awk 'NR > 1 {print $1}')";
                ns3ExecSync(cmdLineString);

                toast({
                  description: "Simulation stopped.",
                });
              }}
            >
              <CircleStop className="mr-2 h-4 w-4" />
              Stop simulation
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                let cmdLineString =
                  "kill -9 $(ps --ppid $(tail -n 1 simulation_trace/" +
                  simulationStatus.username +
                  "/" +
                  simulationStatus.scenario +
                  "." +
                  simulationStatus.name +
                  "/pid.txt) | awk -F'[^0-9]*' '{print $1}'); " +
                  "cd simulation_trace/" +
                  simulationStatus.username +
                  "; rm -r " +
                  simulationStatus.scenario +
                  "." +
                  simulationStatus.name;
                await ns3ExecSync(cmdLineString);
                location.reload();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete simulation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
