import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/index.ts'],
  sourcemap: true,
  format: ['esm', 'cjs'],
  outDir: 'dist',
  shims: true,
  dts: true,
  tsconfig: './tsconfig.type.json',
  target: 'esnext',
});
