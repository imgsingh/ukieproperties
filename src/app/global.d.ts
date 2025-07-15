// global.d.ts or in the same file if appropriate
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'gmp-map': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}
