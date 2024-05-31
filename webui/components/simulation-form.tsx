"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { startSimulation } from "@/components/system-call";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const FormSchema = z.object({
  scenario: z.string().min(1, {
    message: "example must be at least 1 characters.",
  }),
  simulationName: z
    .string()
    .min(2, {
      message: "Simulation name must be at least 2 characters.",
    })
    .regex(/^[^\W]+$/i, "Only letters, numbers and underscore are allowed"),
});

export function SimulationForm({ username, children }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      scenario: children,
      simulationName: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Validate the form values before submitting
    // Display a success toast message after successful submission

    // Create a new simulation folder with the provided name and example name
    const simulationOk = await startSimulation(
      username,
      data.scenario + "." + data.simulationName,
      data.scenario
    );

    if (simulationOk) {
      toast({
        title: "Simulation created successfully!",
        action: (
          <Link href="/dashboard" className="flex">
            <ToastAction altText="View more in dashboard">
              Dashboard
            </ToastAction>
          </Link>
        ),
        description: (
          <div>
            <div>{JSON.stringify(data, null, 2)}</div>
          </div>
        ),
      });
    } else {
      //file already exist!
      toast({
        variant: "destructive",
        title: "Error!",
        description:
          "Name exisits. Please choose a new name for this simulation.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="simulationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name this simulation</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>This is your simulation name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Start</Button>
        </form>
      </Form>
      <div className="py-4 space-x-2">
        <Link
          href={{
            pathname: "/editor",
            query: {
              scenario: children,
            },
          }}
        >
          <Button variant="secondary">Code editor</Button>
        </Link>
      </div>
    </div>
  );
}

export default SimulationForm;
