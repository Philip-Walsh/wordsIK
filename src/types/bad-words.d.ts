declare module 'bad-words' {
    export default class Filter {
        constructor();
        isProfane(text: string): boolean;
    }
} 