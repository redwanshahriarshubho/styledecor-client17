/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#fff1f2',100:'#ffe4e6',200:'#fecdd3',300:'#fda4af',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#be123c',800:'#9f1239',900:'#881337' },
        secondary: {50:'#f0fdfa',100:'#ccfbf1',200:'#99f6e4',300:'#5eead4',400:'#2dd4bf',500:'#14b8a6',600:'#0d9488',700:'#0f766e',800:'#115e59',900:'#134e4a'},
        accent: {50:'#fefce8',100:'#fef9c3',200:'#fef08a',300:'#fde047',400:'#facc15',500:'#eab308',600:'#ca8a04',700:'#a16207',800:'#854d0e',900:'#713f12'}
      },
      fontFamily: { sans:['Inter','system-ui','sans-serif'] },
      spacing: { '18':'4.5rem','88':'22rem','100':'25rem' },
      boxShadow: { soft:'0 2px 15px -3px rgba(0,0,0,0.07),0 10px 20px -2px rgba(0,0,0,0.04)', medium:'0 4px 20px -2px rgba(0,0,0,0.1),0 15px 30px -5px rgba(0,0,0,0.08)', strong:'0 10px 40px -5px rgba(0,0,0,0.2),0 20px 50px -10px rgba(0,0,0,0.15)' },
      animation: { 'fade-in':'fadeIn 0.5s ease-in-out','slide-up':'slideUp 0.5s ease-out','slide-down':'slideDown 0.5s ease-out','bounce-slow':'bounce 3s infinite' },
      keyframes: { fadeIn:{'0%':{opacity:'0'},'100%':{opacity:'1'}}, slideUp:{'0%':{transform:'translateY(20px)',opacity:'0'},'100%':{transform:'translateY(0)',opacity:'1'}}, slideDown:{'0%':{transform:'translateY(-20px)',opacity:'0'},'100%':{transform:'translateY(0)',opacity:'1'}} }
    },
  },
  plugins: [require('daisyui')],
  daisyui:{ themes:[{ light:{ primary:"#f43f5e", secondary:"#14b8a6", accent:"#eab308", neutral:"#1f2937", "base-100":"#ffffff", "base-200":"#f9fafb","base-300":"#f3f4f6", info:"#3b82f6", success:"#10b981", warning:"#f59e0b", error:"#ef4444" } }] }
}; 