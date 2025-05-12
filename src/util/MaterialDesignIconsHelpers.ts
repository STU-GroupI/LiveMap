export function formatIconName(iconName: string): string {
    return iconName
        .replace(/^mdi/, '')
        .replace(/(?!^)([A-Z])(?!$)/g, '-$1')
        .toLowerCase();
}
