/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind'in hangi dosyalardaki class isimlerini okuyacağını buraya yazıyoruz
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // src altındaki tüm react dosyalarını tara
  ],
  theme: {
    extend: {
      // İstersen buraya VetLedger'a özel kurumsal renklerini ekleyebilirsin
      colors: {
        brand: {
          dark: '#020617',
          primary: '#4f46e5',
        }
      }
    },
  },
  plugins: [],
}