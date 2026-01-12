// styled-jsx type declarations
declare namespace JSX {
    interface IntrinsicElements {
        style: React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement> & { jsx?: boolean; global?: boolean }, HTMLStyleElement>;
    }
}

// Type declarations for CSS modules
declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

// Type declarations for image imports
declare module '*.png' {
    const content: {
        src: string;
        height: number;
        width: number;
        blurDataURL?: string;
    };
    export default content;
}

declare module '*.jpg' {
    const content: {
        src: string;
        height: number;
        width: number;
        blurDataURL?: string;
    };
    export default content;
}

declare module '*.jpeg' {
    const content: {
        src: string;
        height: number;
        width: number;
        blurDataURL?: string;
    };
    export default content;
}

declare module '*.gif' {
    const content: {
        src: string;
        height: number;
        width: number;
        blurDataURL?: string;
    };
    export default content;
}

declare module '*.webp' {
    const content: {
        src: string;
        height: number;
        width: number;
        blurDataURL?: string;
    };
    export default content;
}

declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGSVGElement>>;
    export default content;
}
