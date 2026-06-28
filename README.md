/**
 * README - SHIVA PORTFOLIO
 * World-Class Elite Portfolio Website
 * 
 * Dragon-themed Japanese aesthetic with advanced 3D interactivity
 */

# Shiva Sanjay N D - Elite Portfolio

A production-ready, high-end personal portfolio website showcasing professional experience, projects, and skills. Built with React, Three.js, and premium UI/UX design principles.

## 🎨 Design Philosophy

- **Dragon-Themed Japanese Aesthetic**: Minimalist elegance inspired by traditional Japanese culture
- **Strict Black & White Palette**: Premium grayscale hierarchy with refined contrast
- **Elite UI/UX**: Awwwards-inspired design with micro-interactions and smooth animations
- **Performance-Focused**: Optimized 3D elements with lazy loading and LOD techniques
- **Fully Responsive**: Works seamlessly across all devices

## 🚀 Technologies

- **React 18**: Modern component architecture
- **Three.js + React Three Fiber**: Advanced 3D rendering
- **Framer Motion**: Premium animations and transitions
- **GSAP**: High-performance timeline animations
- **Vite**: Lightning-fast build tool
- **CSS Modules**: Scoped styling

## 📁 Project Structure

```
src/
├── components/
│   ├── 3D/
│   │   ├── Dragon.jsx           # Animated 3D dragon centerpiece
│   │   ├── ParticlesBackground.jsx
│   │   └── index.js
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Section.jsx
│   │   ├── SkillCard.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── Navigation.jsx
│   │   ├── Footer.jsx
│   │   └── index.js
│   └── sections/
│       ├── Hero.jsx
│       ├── About.jsx
│       ├── Skills.jsx
│       ├── Projects.jsx
│       ├── Experience.jsx
│       ├── Contact.jsx
│       └── index.js
├── styles/
│   └── globals.css              # Design system & typography
├── data/
│   └── resume.js                # Structured resume data
├── App.jsx
└── main.jsx
```

## 🎯 Features

### Core Sections
- **Hero**: Animated intro with 3D dragon and typed greeting
- **About**: Professional summary, education, interests, languages
- **Skills**: Programming languages, expertise tags, proficiency breakdown
- **Projects**: Expandable project cards with highlights
- **Experience**: Timeline view, awards & recognition
- **Contact**: Multiple contact channels, message form

### Visual Elements
- 3D Animated Dragon (custom geometry)
- Floating geometric orbs
- Particle background
- Smooth scroll behavior
- Parallax effects
- Micro-interactions on hover
- Loading animations

### Performance Optimizations
- Code splitting with Vite
- Lazy loading of 3D assets
- Optimized bundle size
- GPU-accelerated animations
- Responsive image handling

## 🛠️ Development

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Opens automatically at `http://localhost:3000`

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm preview
```

## 🎨 Design System

### Color Palette
- **Black**: #000000
- **White**: #ffffff
- **Grays**: #f5f5f5 to #1a1a1a (10 levels)

### Typography
- **Heading Font**: Noto Serif JP (Premium Japanese serif)
- **Body Font**: Inter (Clean, modern sans-serif)
- **Scale**: 64px (H1) to 12px (Caption)

### Spacing
- **Base Unit**: 8px
- **System**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

### Animation
- **Duration**: 150ms (fast), 300ms (normal), 500ms (slow)
- **Easing**: Custom cubic-bezier functions for premium feel

## 📱 Responsive Design

- **Mobile**: 0-480px - Full stack layout
- **Tablet**: 480-768px - Adjusted spacing and typography
- **Desktop**: 768px+ - Full grid layouts
- **Wide**: 1440px+ - Maximum width container

## 🌐 Deployment

### Recommended Platforms
- **Vercel** (Optimal for Next.js/Vite)
- **Netlify** (Easy drag-and-drop)
- **GitHub Pages**
- **Custom VPS**

### Build & Deploy
```bash
npm run build
# Deploy the 'dist' folder
```

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- High contrast ratios
- Focus states on all interactive elements
- Screen reader optimized

## 📊 Performance Metrics

Target scores:
- Lighthouse Performance: 95+
- Core Web Vitals: Good
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 3s
- Cumulative Layout Shift: < 0.1

## 🔧 Customization

### Change Resume Data
Edit `src/data/resume.js` with your information:
```javascript
export const resumeData = {
  personal: {
    name: 'Your Name',
    email: 'your@email.com',
    // ... more fields
  },
  // ... more sections
};
```

### Modify Colors
Update CSS variables in `src/styles/globals.css`:
```css
:root {
  --color-black: #000000;
  --color-white: #ffffff;
  /* ... more colors */
}
```

### Customize Dragon
Edit `src/components/3D/Dragon.jsx` to modify the 3D geometry, materials, or animations.

## 📝 License

This portfolio is custom-built and not licensed for redistribution.

## 🤝 Support

For customizations or technical issues, refer to:
- React Documentation: https://react.dev
- Three.js: https://threejs.org
- Framer Motion: https://www.framer.com/motion
- Vite: https://vitejs.dev

---

**Built with precision, elegance, and innovation.**
