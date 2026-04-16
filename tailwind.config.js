/**
 * Tailwind CSS v4 — konfigurasi utama dilakukan via @theme di globals.css
 * File ini dipertahankan untuk kompatibilitas tooling (editor hints, dll.)
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
