export const minimumPasswordLength = 8;

export function validatePassword(password: string) {
  if (password.length < minimumPasswordLength) {
    return `Password must be at least ${minimumPasswordLength} characters.`;
  }

  return null;
}

export function validatePasswordConfirmation(password: string, confirmation: string) {
  const passwordError = validatePassword(password);

  if (passwordError) {
    return passwordError;
  }

  if (password !== confirmation) {
    return "Passwords do not match.";
  }

  return null;
}
