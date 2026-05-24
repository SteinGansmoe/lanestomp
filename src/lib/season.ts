export const seasonDateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatSeasonDate(date: string) {
  return seasonDateFormatter.format(new Date(`${date}T00:00:00`));
}

export function getRemainingTime(endDate: string, now = new Date()) {
  const end = new Date(`${endDate}T23:59:59`).getTime();
  const diffInMinutes = Math.max(
    0,
    Math.floor((end - now.getTime()) / (1000 * 60))
  );
  const days = Math.floor(diffInMinutes / (60 * 24));
  const hours = Math.floor((diffInMinutes % (60 * 24)) / 60);
  const minutes = diffInMinutes % 60;

  if (diffInMinutes <= 0) {
    return "Ended";
  }

  if (days >= 30) {
    const months = Math.floor(days / 30);

    return `${months}+ ${months === 1 ? "month" : "months"}`;
  }

  return `${days}d ${hours}h ${minutes}m`;
}

export function getSeasonProgress(
  startDate: string,
  endDate: string,
  now = new Date()
) {
  const start = new Date(`${startDate}T00:00:00`).getTime();
  const end = new Date(`${endDate}T23:59:59`).getTime();
  const nowTime = now.getTime();

  if (nowTime <= start) {
    return 0;
  }

  if (nowTime >= end) {
    return 100;
  }

  return Math.round(((nowTime - start) / (end - start)) * 100);
}
