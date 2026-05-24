export function isMissingGameResourcesTableError(
  error: { code?: string; message?: string } | null
) {
  return (
    error?.code === "PGRST205" ||
    Boolean(
      error?.message?.includes("game_resources") &&
        error.message.includes("schema cache")
    )
  );
}

export function formatDate(value: string) {
  return value.slice(0, 10);
}

export function toDateTimeLocalValue(value: string) {
  return value.slice(0, 16);
}

export function toIsoDateTime(value: string) {
  return new Date(value).toISOString();
}
