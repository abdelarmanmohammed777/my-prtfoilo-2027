import { build } from "esbuild";
await build({ entryPoints: ["src/main.jsx"], bundle: true, minify: true, format: "iife", target: "es2018", outfile: "public/app.js", loader: { ".jsx": "jsx", ".json": "json" }, define: { "process.env.NODE_ENV": '"production"' } });
console.log("✔ built frontend/public/app.js");
