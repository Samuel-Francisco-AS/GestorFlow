export function shouldClearSessionCache(
  previousUserId: string | null,
  nextUserId: string | null,
) {
  return previousUserId !== nextUserId
}
