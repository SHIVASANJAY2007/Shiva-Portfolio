# CUSTOMIZATION GUIDE

## Quick Start Customization

### 1. Update Resume Data

Edit `src/data/resume.js`:

```javascript
export const resumeData = {
  personal: {
    name: 'Your Full Name',
    title: 'Your Title',
    email: 'your.email@example.com',
    phone: '+1 234-567-8900',
    location: 'City, Country',
    summary: 'Your professional summary...',
  },
  // ... update other sections
};
```

### 2. Change Colors

Edit `src/styles/globals.css` - adjust the CSS variables:

```css
:root {
  --color-black: #000000;      /* Black background */
  --color-white: #ffffff;      /* White text/elements */
  --color-gray-100: #f5f5f5;   /* Lightest gray */
  --color-gray-600: #505050;   /* Medium gray */
  /* ... more grays for hierarchy */
}
```

### 3. Modify Typography

Update font imports in `index.html`:

```html
<!-- Replace with your preferred fonts -->
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@400;600;700&display=swap" rel="stylesheet" />
```

Then update in `globals.css`:

```css
--font-primary: 'Your Font Name', serif;
--font-secondary: 'Your Font Name', sans-serif;
```

### 4. Customize Dragon 3D Model

Edit `src/components/3D/Dragon.jsx`:

```javascript
// Modify geometry
<icosahedronGeometry args={[0.8, 4]} /> // Change numbers for size/detail

// Change materials
<meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.2} />

// Add more components
// Create new geometric shapes
```

### 5. Add Your Own Sections

Create a new section file in `src/components/sections/`:

```javascript
import React from 'react';
import { Section } from '../common';

export const MySection = () => {
  return (
    <Section id="my-section" title="Section Title">
      {/* Your content */}
    </Section>
  );
};
```

Then import and add to `src/App.jsx`:

```javascript
import { MySection } from './components/sections';

export default function App() {
  return (
    <div className="app">
      <Navigation />
      <main>
        {/* ... existing sections */}
        <MySection />
      </main>
      <Footer />
    </div>
  );
}
```

### 6. Add New Skills

Edit `src/data/resume.js`:

```javascript
skills: {
  programming: [
    { name: 'React', level: 4 },
    { name: 'Node.js', level: 3 },
    // Add more
  ],
  other: [
    'Skill Name',
    'Another Skill',
  ]
}
```

### 7. Add New Projects

Edit `src/data/resume.js`:

```javascript
projects: [
  {
    id: 'project-id',
    name: 'Project Name',
    year: 2025,
    description: 'Project description...',
    highlights: ['Feature 1', 'Feature 2'],
  },
  // Add more
]
```

### 8. Add Contact Links

Update `resumeData.profiles` in `src/data/resume.js`:

```javascript
profiles: {
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourprofile',
  twitter: 'https://twitter.com/yourhandle', // Add custom
  portfolio: 'https://yourwebsite.com',       // Add custom
}
```

### 9. Add Animation Effects

Use provided components:

```javascript
import { ScrollReveal, ParallaxSection } from '../components/common/Animations';

<ScrollReveal direction="up" delay={0.2}>
  <h2>Animated heading</h2>
</ScrollReveal>

<ParallaxSection offset={50}>
  <img src="image.jpg" />
</ParallaxSection>
```

### 10. Add Hover Interactions

Use Framer Motion:

```javascript
import { motion } from 'framer-motion';

<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => {}}
>
  Click Me
</motion.button>
```

## Advanced Customizations

### Change Spacing System

Edit `src/styles/globals.css`:

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  /* Adjust multipliers as needed */
}
```

### Add Dark Mode

Create `src/styles/theme.css`:

```css
body.dark-mode {
  --color-black: #1a1a1a;
  --color-white: #e0e0e0;
  /* Update colors */
}
```

### Integrate Analytics

Add to `src/main.jsx`:

```javascript
import ReactDOM from 'react-dom/client';
import { analytics } from './utils/analytics'; // Create this

// Initialize analytics
analytics.init('YOUR_TRACKING_ID');
```

### Add Form Backend

Replace email form with backend API in `src/components/sections/Contact.jsx`:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formState),
  });
  
  // Handle response
};
```

### Add Blog Section

Create `src/components/sections/Blog.jsx`:

```javascript
export const Blog = () => {
  const [posts, setPosts] = React.useState([]);
  
  React.useEffect(() => {
    // Fetch blog posts
  }, []);
  
  return (
    <Section id="blog" title="Latest Posts">
      {/* Blog posts grid */}
    </Section>
  );
};
```

## Style System Classes

### Typography
- `.sr-only` - Screen reader only text
- `h1` through `h6` - Heading levels
- `.caption` - Small caption text

### Layout
- `.container` - Max-width container
- `.section` - Full-width section
- `.grid` - CSS grid layout

### Interactive
- `.button` - Button styles
- `.link` - Link hover effects
- `.card` - Card component

## Responsive Breakpoints

```javascript
// Mobile First Approach
// Base styles: mobile
// @media (min-width: 768px) - Tablet
// @media (min-width: 1024px) - Desktop
// @media (min-width: 1440px) - Wide
```

## Deployment Customizations

### Environment Variables

Create `.env.local`:

```env
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_ID=UA-XXXXXXXXX-X
VITE_CONTACT_EMAIL=your@email.com
```

Access in code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Build Configuration

Modify `vite.config.js`:

```javascript
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
});
```

## Testing Customizations

Add unit tests in `src/components/__tests__/`:

```javascript
import { render, screen } from '@testing-library/react';
import { Button } from '../common/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

---

For more help, refer to component source files with inline documentation.
