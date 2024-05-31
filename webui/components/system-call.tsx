"use server";
import ollama from "ollama";

function serverExecSync(cmd: string) {
  const { execSync } = require("child_process");
  // stderr is sent to stderr of parent process
  // you can set options.stdio if you want it to go elsewhere
  try {
    const stdout = execSync(cmd);
    return stdout.toString();
  } catch (err) {
    const stdout = err;
    return stdout.toString();
  }
}

function ns3ExecSync(cmd: string) {
  const ns3Cmd = "cd " + process.env.NS3_PATH + "; " + cmd;
  const { execSync } = require("child_process");
  // stderr is sent to stderr of parent process
  // you can set options.stdio if you want it to go elsewhere
  try {
    const stdout = execSync(ns3Cmd);
    return stdout.toString();
  } catch (err) {
    const stdout = err;
    return stdout.toString();
  }
}

function ns3Exec(cmd: string) {
  const ns3Cmd = "cd " + process.env.NS3_PATH + "; " + cmd;
  const { exec } = require("child_process");
  exec(ns3Cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }
  });
}

function getData(username) {
  // Fetch data from your API here.
  let cmdLineString = "mkdir simulation_trace";
  let stdout = ns3ExecSync(cmdLineString);

  cmdLineString = "cd simulation_trace; mkdir " + username;
  stdout = ns3ExecSync(cmdLineString);

  cmdLineString = "cd simulation_trace/" + username + "; ls";

  // Run the command in a new terminal window and capture the output
  stdout = ns3ExecSync(cmdLineString);
  let simArray = stdout.split("\n").filter((i) => i);

  function getTraces(folderName) {
    const cmdLineString =
      "cd simulation_trace/" + username + "; ls " + folderName;
    const stdout = ns3ExecSync(cmdLineString);
    //console.log(stdout);
    return stdout.split("\n").filter((i) => i);
  }

  function getStatus(folderName) {
    const cmdLineString =
      "ps --ppid $(tail -n 1 simulation_trace/" +
      username +
      "/" +
      folderName +
      "/pid.txt)";
    const stdout = ns3ExecSync(cmdLineString);
    //console.log(stdout);

    const slicedStdout = stdout.slice(0, 5);
    if (slicedStdout === "Error") {
      return "stopped";
    } else {
      return "running";
    }
    //return stdout.split("\n").filter((i) => i);
  }

  function getProgress(folderName) {
    const cmdLineString =
      "tail -n 1 simulation_trace/" +
      username +
      "/" +
      folderName +
      "/simulation_status.txt";
    const stdout = ns3ExecSync(cmdLineString).split(",");
    let progressPer = 0;
    if (+stdout[1] == 0) {
      progressPer = 100;
    } else if (+stdout[1] > 0) {
      progressPer = Math.ceil((100 * +stdout[0]) / +stdout[1]);
    }
    return progressPer;
  }

  const simExtendedArray = simArray.map((sim) => ({
    files: getTraces(sim),
    status: getStatus(sim),
    loading: false,
    progress: getProgress(sim),
    scenario: sim.split(".")[0],
    name: sim.split(".")[1],
    username: username,
  }));

  return simExtendedArray;
}

function startSimulation(username, folderName, scenario) {
  let cmdLineString = "mkdir simulation_trace";
  let stdout = ns3ExecSync(cmdLineString);

  cmdLineString = "cd simulation_trace; mkdir " + username;
  stdout = ns3ExecSync(cmdLineString);

  cmdLineString = "mkdir simulation_trace/" + username + "/" + folderName;

  // Run the command in a new terminal window and capture the output
  stdout = ns3ExecSync(cmdLineString);
  const slicedStdout = stdout.slice(stdout.length - 12, stdout.length - 1);

  if (slicedStdout !== "File exists") {
    cmdLineString =
      "./ns3 run " +
      scenario +
      " --cwd=simulation_trace/" +
      username +
      "/" +
      folderName +
      " > simulation_trace/" +
      username +
      "/" +
      folderName +
      "/terminal_output.txt 2>&1 & echo $! > simulation_trace/" +
      username +
      "/" +
      folderName +
      "/pid.txt";

    // Run the command in a new terminal window and capture the output
    ns3Exec(cmdLineString);
    return true;
  } else {
    //file already exist!
    return false; //error
  }
}

async function OllamaChat(input: string) {
  const response = await ollama.chat({
    model: "codellama:instruct",
    messages: [
      {
        role: "user",
        content: input,
      },
    ],
  });
  return response.message.content;
}
export {
  serverExecSync,
  ns3ExecSync,
  ns3Exec,
  getData,
  startSimulation,
  OllamaChat,
};
