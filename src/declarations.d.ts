/*
 * This project is intended to be built in an offline environment where the
 * actual React and third‑party packages are not available.  During
 * development we rely on the types shipped with those packages, but the
 * sandbox used for this exercise cannot install them from the network.
 *
 * To allow TypeScript to compile without complaining about missing module
 * declarations or JSX types, we provide a handful of very loose ambient
 * declarations here.  Every declaration exports `any` or very generic
 * shapes.  These are **not** intended for production use but simply to
 * satisfy the TypeScript compiler when the real packages are absent.  When
 * the project is installed in a real environment the declarations from
 * the actual packages will take precedence.
 */

// Allow arbitrary JSX tags by defining a catch‑all IntrinsicElements map.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Minimal declarations for React.  We export a default `React` object as
// `any` and a few commonly used hooks and types.  The goal is to avoid
// compile errors stemming from missing types rather than provide full
// typings.  When the real React package is installed these declarations
// will be ignored.
declare module 'react' {
  const React: any;
  export default React;
  export const useState: any;
  export const useEffect: any;
  export const useMemo: any;
  export const useRef: any;
  export const useContext: any;
  export const useReducer: any;
  export const createContext: any;
  export const createElement: any;
  export const cloneElement: any;
  export const forwardRef: any;
  export type PropsWithChildren<P = any> = P & { children?: any };
}

// Minimal declaration for the ReactDOM client entry point used by Vite.
declare module 'react-dom/client' {
  const anyClient: any;
  export default anyClient;
}

// Minimal declarations for React Router DOM.  We don't attempt to type
// individual exports because the actual package will provide the real
// definitions.  Instead we export `any` so that `import { BrowserRouter,
// Route, Routes, Link } from 'react-router-dom'` compiles.
declare module 'react-router-dom' {
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export const Navigate: any;
  export const useNavigate: any;
  export const useLocation: any;
  export const Link: any;
  export default any;
}

// Minimal declarations for Swiper React components and modules.  The Swiper
// library provides React components via 'swiper/react' and modules via
// 'swiper/modules'.  We stub these as `any` so that importing them does
// not error during type checking.
declare module 'swiper/react' {
  export const Swiper: any;
  export const SwiperSlide: any;
  export default any;
}

declare module 'swiper/modules' {
  export const Navigation: any;
  export const Pagination: any;
  export default any;
}

// Minimal declaration for the AOS (Animate On Scroll) library used for
// scroll animations.  The actual library exports a default object with
// an `init` function; we mirror that signature loosely.
declare module 'aos' {
  interface AOS {
    init: (...args: any[]) => any;
    refresh: (...args: any[]) => any;
    [key: string]: any;
  }
  const AOS: AOS;
  export default AOS;
}

// Catch‑all modules for any other third‑party imports that are not
// available offline.  If you import a module that is not explicitly
// declared above it will fall back to this declaration which exports
// `any`.  Add additional modules here as needed.
declare module '@/*';
declare module '*.json' {
  const value: any;
  export default value;
}