class JString {
    constructor(value) {
        this.value = value;
    }

    length() {
        return this.value.length;
    }

    charAt(index) {
        return this.value.charAt(index);
    }

    charCodeAt(index) {
        return this.value.charCodeAt(index);
    }

    substring(start, end) {
        return this.value.substring(start, end);
    }

    indexOf(searchValue, fromIndex) {
        return this.value.indexOf(searchValue, fromIndex);
    }

    lastIndexOf(searchValue, fromIndex) {
        return this.value.lastIndexOf(searchValue, fromIndex);
    }

    replace(searchValue, replaceValue) {
        return this.value.replace(searchValue, replaceValue);
    }

    trim() {
        return this.value.trim();
    }

    toLowerCase() {
        return this.value.toLowerCase();
    }

    toUpperCase() {
        return this.value.toUpperCase();
    }

    contains(sequence) {
        return this.value.includes(sequence);
    }

    startsWith(prefix) {
        return this.value.startsWith(prefix);
    }

    endsWith(suffix) {
        return this.value.endsWith(suffix);
    }

    concat(str) {
        return this.value.concat(str);
    }

    toString() {
        return this.value;
    }
    equals(str) {
        return this.value === str;
    }
}

class JQueue {
    constructor() {
        this.items = [];
    }

    add(element) {
        this.items.push(element);
    }

    poll() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }

    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}
