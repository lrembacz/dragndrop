export function matchesWithAncestors(element: Element, selectors: string): boolean {
    do {
        if (element.matches(selectors)) return true;
        element = element.parentElement;
    } while (element != null);
    return false;
}