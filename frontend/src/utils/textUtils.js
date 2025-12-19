export function truncateChars(str, max = 15) {
    if (str === null || str === undefined) return '';
    const s = String(str).trim();
    if (s.length <= max) return s;
    return s.slice(0, max) + '...';
}

export default truncateChars;
