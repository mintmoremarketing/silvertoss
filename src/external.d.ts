// This file declares external modules that are provided at runtime via
// import maps. Without these declarations TypeScript will raise
// "Cannot find module" errors when compiling the project. The actual
// implementations of these modules are supplied via compiled
// JavaScript files in the `public/libs` folder and referenced via
// import maps in `index.html`.

declare module 'react';
declare module 'react-dom';
declare module 'react-router-dom';
declare module 'aos';
declare module 'swiper';
declare module '@types/react';
declare module '@types/react-dom';

// The JSX runtime modules are used by the "react-jsx" JSX transform. They
// are provided by the pre-built React library shipped in `public/libs`.
declare module 'react/jsx-runtime';
declare module 'react/jsx-dev-runtime';