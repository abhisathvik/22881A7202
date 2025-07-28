import axios from "axios";

const LOG_API = "http://20.244.56.144/evaluation-service/logs";
const ACCESS_TOKEN = "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhbmlnYWFiaGlzYXRodmlrcmVkZHkyMmFpZHNAc3R1ZGVudC52YXJkaGFtbi5vcmciLCJleHAiOjE3NTM2ODA1MzUsImlhdCI6MTc1MzY3OTYzNSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjgzNDk4MDI0LWJlNzUtNDZjMC05NmNlLThhMWM5NzBkM2U5MiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFuaWdhIGFiaGkgc2F0aHZpayByZWRkeSIsInN1YiI6IjQzODQxMWIxLWJjNDktNGQzOC04MGNjLTg0OTJiMmVhMDdlNiJ9LCJlbWFpbCI6ImFuaWdhYWJoaXNhdGh2aWtyZWRkeTIyYWlkc0BzdHVkZW50LnZhcmRoYW1uLm9yZyIsIm5hbWUiOiJhbmlnYSBhYmhpIHNhdGh2aWsgcmVkZHkiLCJyb2xsTm8iOiIyMjg4MWE3MjAyIiwiYWNjZXNzQ29kZSI6IndQRWZHWiIsImNsaWVudElEIjoiNDM4NDExYjEtYmM0OS00ZDM4LTgwY2MtODQ5MmIyZWEwN2U2IiwiY2xpZW50U2VjcmV0IjoiU1N1WEFrUVRqZlN0d2tGRiJ9.6s8KFO_ncaiOxi5PSJCTcJlWHBhhsH4S2AnPXMio7HA";

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
