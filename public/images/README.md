# Image Placeholders

This directory should contain project images referenced in `projects.json`.

## Required Images

Replace these placeholders with your actual project images:

1. **ecommerce-project.jpg** - E-Commerce Platform screenshot
2. **task-manager-project.jpg** - Task Management App screenshot
3. **cms-project.jpg** - Portfolio CMS screenshot
4. **analytics-project.jpg** - Analytics Dashboard screenshot
5. **fitness-project.jpg** - Mobile Fitness Tracker screenshot

## Image Guidelines

- **Recommended Size**: 800x600px minimum for cards, 1200x800px for detail view
- **Aspect Ratio**: 4:3 or 16:9 works best
- **Format**: JPG, PNG, or WebP
- **Optimization**: Compress images for web (aim for < 200KB per image)
- **Alt Text**: Update the title in projects.json for accessibility

## Adding Images

1. Place your images in this directory
2. Update the `image` field in `public/data/projects.json` to match your filenames
3. Rebuild the Docker container:
   ```
   docker-compose down
   docker-compose up --build -d
   ```

## Placeholder Behavior

If an image fails to load, the JavaScript will gracefully hide the broken image element, showing only the gradient background.
