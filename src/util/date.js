export function formatDate(date) {
    return date.toLocaleDateString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}