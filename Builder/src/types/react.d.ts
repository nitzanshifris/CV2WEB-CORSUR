/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extend as needed
  }
}
