import DrawerDialogDemo from "@/components/drawer";
import { ns3ExecSync } from "@/components/system-call";

/**
 * Removes an item from an array only once. The item is removed based on the value passed in as the second argument.
 * @param arr {any[]} - The original array of items to remove from.
 * @param value {string} - The value of the item to be removed.
 * @returns {any[]} - A new array containing all items except for the one that matches the passed in value.
 */
export function removeItemOnce(arr: any[], value: string): any[] {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

// This function will list all the available examples from the ns-3
const ExampleList = ({ username }) => {
  // First, we need to get a list of all the files in that directory
  const stdout = ns3ExecSync("./ns3 show targets");
  // Then, we'll split the output into an array based on line breaks
  const exampleOut = stdout.split("Runnable/Buildable targets:\n")[1];
  let exampleArray = exampleOut.split(/[\s\n]+/);
  // Next, we need to remove any empty or irrelevant items from the array
  // This is done by using the "removeItemOnce" function that we defined earlier
  exampleArray = removeItemOnce(exampleArray, "");
  exampleArray = removeItemOnce(exampleArray, "CMakeLists.txt");

  return (
    <div className="space-y-2">
      {/* We'll render each item in the array as a separate DrawerDialogDemo component */}
      {exampleArray.map((example: any) => (
        <DrawerDialogDemo username={username}>{example}</DrawerDialogDemo>
      ))}
    </div>
  );
};

export default ExampleList;
