export function formatDate(date) {
    console.log(date)
    return date.toLocaleDateString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}