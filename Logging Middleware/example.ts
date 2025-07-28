import { Log } from "./log";

async function simulateErrors() {
  await Log("backend", "error", "handler", "received string, expected bool");
  await Log("backend", "fatal", "db", "Critical database connection failure.");
}

simulateErrors();
