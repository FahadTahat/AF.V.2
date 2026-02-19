/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    // autoprefixer is usually not needed with v4 as it handles prefixing, 
    // but keeping it if explicitly desired, though v4 docs say it's included.
    // However, for compatibility with v4, using just @tailwindcss/postcss is often enough.
    // But let's stick to the migration guide which says to use @tailwindcss/postcss.
  },
}

export default config
