import axios from "axios";

const LOG_API = "http://20.244.56.144/evaluation-service/logs";
const ACCESS_TOKEN = "<your-access-token>";

type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type BackendPackage =
  | "cache" | "controller" | "cron_job" | "db"
  | "domain" | "handler" | "repository" | "route" | "service";
type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style";
type SharedPackage = "auth" | "config" | "middleware" | "utils";
type Package = BackendPackage | FrontendPackage | SharedPackage;

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
) {
  try {
    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Log created:", response.data.message);
  } catch (error: any) {
    console.error("Log failed:", error.response?.data || error.message);
  }
}
