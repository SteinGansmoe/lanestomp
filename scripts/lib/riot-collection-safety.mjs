// Do not infer key approval from its format: development and production keys share a prefix.
// Production collection stays closed until a reviewed code change after Riot approval.
export function getRiotCollectionBlockReason(env = process.env) {
  if (env.NODE_ENV === "production" || env.VERCEL_ENV === "production") {
    return "Riot API collection is temporarily disabled in production pending approval.";
  }
  return null;
}

export function assertRiotCollectionAllowed(env = process.env) {
  const reason = getRiotCollectionBlockReason(env);
  if (reason) throw new Error(reason);
}
