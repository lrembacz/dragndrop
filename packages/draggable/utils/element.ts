import {matches} from '@material/dom/ponyfill';

export function matchesWithAncestors(element: Element, selectors: string): boolean {
    do {
        if (matches(element, selectors)) return true;
        element = element.parentElement;
    } while (element != null);
    return false;
}