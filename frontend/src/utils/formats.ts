export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price)
}

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours > 0) {
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ""}`
  }
  return `${minutes}m`
}

export const formatDate = (date: Date | string): string => {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export const formatTime = (date: Date | string): string => {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(date))
}
