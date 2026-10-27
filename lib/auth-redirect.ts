export function safeReturnTo(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\"))
    return "/dashboard";
  return value;
}
