import { execFileSync } from "node:child_process";

const ports = process.argv.slice(2);
const targetPorts = ports.length > 0 ? ports : ["3000", "3001", "3002", "3003"];
const pids = new Set();

for (const port of targetPorts) {
  try {
    const output = execFileSync("lsof", [`-tiTCP:${port}`, "-sTCP:LISTEN"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    for (const pid of output.split(/\s+/).filter(Boolean)) {
      pids.add(Number(pid));
    }
  } catch {
    // No listener on this port.
  }
}

if (pids.size === 0) {
  console.log(`No dev server found on ports ${targetPorts.join(", ")}.`);
  process.exit(0);
}

for (const pid of pids) {
  try {
    process.kill(pid, "SIGTERM");
    console.log(`Stopped process ${pid}.`);
  } catch (error) {
    console.warn(`Could not stop process ${pid}: ${error.message}`);
  }
}
