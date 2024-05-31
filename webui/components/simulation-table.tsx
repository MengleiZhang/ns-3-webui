"use client";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { Form } from "@/lib/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getData } from "@/components/system-call";
import { useRef, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { set } from "react-hook-form";
export default function SimulationTable({ children }) {
  const [data, setData] = useState([
    {
      loading: true,
    },
  ]);

  const buttonRef = useRef(null);

  // Action
  async function refreshTable() {
    const results = await getData(children);
    //console.log(results);
    setData(results);
    // Logic to mutate data...
  }

  //Add auto refresh table.

  useEffect(() => {
    buttonRef.current.click();

    const interval = setInterval(() => {
      buttonRef.current.click();
    }, 10000);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  // Invoke the action using the "action" attribute
  return (
    <div>
      <Button
        ref={buttonRef}
        variant="secondary"
        onClick={refreshTable}
        className="hidden"
      >
        Refresh Table
      </Button>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
