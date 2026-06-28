# QUICK REFERENCE

## File Structure

```
src/
├── components/
│   ├── 3D/
│   │   ├── Dragon.jsx          # 3D animated dragon
│   │   ├── ParticlesBackground.jsx
│   │   └── index.js
│   ├── common/
│   │   ├── Button.jsx          # Reusable button
│   │   ├── Section.jsx         # Section wrapper
│   │   ├── SkillCard.jsx       # Skill display
│   │   ├── ProjectCard.jsx     # Project display
│   │   ├── Navigation.jsx      # Header nav
│   │   ├── Footer.jsx          # Footer
│   │   ├── Animations.jsx      # Animation utilities
│   │   └── index.js
│   └── sections/
│       ├── Hero.jsx            # Hero section
│       ├── About.jsx           # About section
│       ├── Skills.jsx          # Skills section
│       ├── Projects.jsx        # Projects section
│       ├── Experience.jsx      # Experience/Awards
│       ├── Contact.jsx         # Contact section
│       └── index.js
├── styles/
│   └── globals.css             # Design system
├── data/
│   └── resume.js               # Resume data (EDIT THIS!)
├── hooks/
│   ├── useScrollDirection.js
│   ├── useInViewport.js
│   └── index.js
├── utils/
│   └── index.js                # Helper functions
├── App.jsx                     # Main component
└── main.jsx                    # Entry point
```

## Common Tasks

### Update Resume Data
```bash
# Edit this file
src/data/resume.js

# Key sections to update:
- personal (name, email, phone, location)
- education
- projects
- skills
- experience
- awards
- interests
- languages
```

### Add New Section
```javascript
// 1. Create src/components/sections/MySection.jsx
import React from 'react';
import { Section } from '../common';

export const MySection = () => {
  return <Section title="My Section">Content</Section>;
};

// 2. Add to src/App.jsx
import { MySection } from './components/sections';
// Add <MySection /> in main

// 3. Update Navigation links if needed
```

### Add New Skill
```javascript
// Edit src/data/resume.js
skills: {
  programming: [
    { name: 'React', level: 4 },  // 1-5 scale
    { name: 'Your Skill', level: 3 }
  ]
}
```

### Add New Project
```javascript
// Edit src/data/resume.js
projects: [
  {
    id: 'unique-id',
    name: 'Project Name',
    year: 2025,
    description: 'Description...',
    highlights: ['Feature 1', 'Feature 2']
  }
]
```

### Change Colors
```css
/* Edit src/styles/globals.css */
:root {
  --color-black: #000000;
  --color-white: #ffffff;
  /* 10 gray levels provided */
}
```

### Modify Dragon 3D
```javascript
// Edit src/components/3D/Dragon.jsx

// Geometry: change size/detail
<icosahedronGeometry args={[0.8, 4]} />

// Material: change appearance
<meshStandardMaterial color="#white" roughness={0.4} />

// Add new elements in DragonMesh
```

## Common Errors

| Error | Solution |
|-------|----------|
| `Cannot find module 'react'` | Run `npm install` |
| `Port 3000 already in use` | Change port in `vite.config.js` or kill process |
| `Failed to resolve '@react-three/fiber'` | Run `npm install` |
| `Dragon not rendering` | Check console for Three.js errors |
| `Styles not applying` | Verify CSS modules are imported |
| `Layout issues` | Check media queries in CSS modules |

## Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Create production build
npm run preview         # Preview production build

# Utilities
npm run lint            # Check code quality
npm test                # Run tests (if configured)

# Deployment
npm run build           # Always build before deploy
npm preview             # Test before deploying
```

## Design System

### Typography
- **Headings**: Noto Serif JP (premium Japanese serif)
- **Body**: Inter (clean, modern)
- **Sizes**: 12px to 64px scale

### Spacing (8px base)
- `--space-1`: 4px
- `--space-2`: 8px
- `--space-4`: 16px
- `--space-6`: 24px
- `--space-8`: 32px
- `--space-12`: 48px
- `--space-16`: 64px
- `--space-20`: 80px

### Colors
- **Black** (#000000) - Background
- **White** (#ffffff) - Primary text
- **Grays** - 10 levels for hierarchy

### Animation
- **Fast**: 150ms
- **Normal**: 300ms
- **Slow**: 500ms
- **Easing**: Custom cubic-bezier

## Performance Tips

1. Minimize 3D complexity
2. Lazy load heavy components
3. Use CSS for animations when possible
4. Optimize images
5. Tree-shake unused code
6. Monitor bundle size

## Accessibility

- Semantic HTML ✓
- Keyboard navigation ✓
- ARIA labels ✓
- High contrast ✓
- Focus states ✓

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: Latest versions

## Key Dependencies

```json
{
  "react": "^18.2.0",
  "three": "^r158",
  "@react-three/fiber": "^8.15.0",
  "framer-motion": "^10.16.0",
  "gsap": "^3.12.2"
}
```

## Useful Links

- [React Docs](https://react.dev)
- [Three.js](https://threejs.org)
- [Framer Motion](https://www.framer.com/motion)
- [Vite](https://vitejs.dev)
- [MDN Web Docs](https://developer.mozilla.org)

## Git Workflow

```bash
# Initial setup
git init
git add .
git commit -m "Initial portfolio setup"
git branch -M main
git remote add origin https://github.com/user/portfolio.git
git push -u origin main

# Regular updates
git add .
git commit -m "Update resume data"
git push
```

## Deployment Quick Links

- **Vercel**: https://vercel.com/import
- **Netlify**: https://app.netlify.com
- **GitHub Pages**: Settings > Pages
- **AWS**: https://aws.amazon.com

---

**Need help? Check README.md, CUSTOMIZATION.md, or DEPLOYMENT.md**
