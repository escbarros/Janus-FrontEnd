/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: [
        './App.tsx',
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Baloo2-Regular', 'sans-serif'],
                'sans-medium': ['Baloo2-Medium', 'sans-serif'],
                'sans-semibold': ['Baloo2-SemiBold', 'sans-serif'],
                'sans-bold': ['Baloo2-Bold', 'sans-serif'],
                'sans-extrabold': ['Baloo2-ExtraBold', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
