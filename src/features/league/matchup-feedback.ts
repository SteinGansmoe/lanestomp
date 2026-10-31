export const FEEDBACK_MESSAGE_MAX_LENGTH = 4000;

export function canSubmitMatchupFeedback(
  matchup: { id?: number | null; generation_status?: string | null } | null | undefined,
) {
  return Boolean(matchup?.id && matchup.generation_status === "reviewed");
}

export function prepareFeedbackMessage(message: string) {
  const text = message.trim();
  // PostgreSQL char_length counts code points, not JavaScript UTF-16 units.
  const length = Array.from(text).length;
  return { text: text || null, length, isTooLong: length > FEEDBACK_MESSAGE_MAX_LENGTH };
}

export function getFeedbackSubmissionError(error?: { code?: string; message?: string }) {
  if (error?.message === "Feedback message must be at most 4000 characters.") {
    return "Please shorten your feedback to 4,000 characters or fewer.";
  }
  if (error?.message === "A reviewed matchup with the specified lane is required.") {
    return "This guide is no longer published. Refresh the page before sending feedback.";
  }
  return "We couldn't save your feedback. Please try again, or refresh the page if the problem continues.";
}
