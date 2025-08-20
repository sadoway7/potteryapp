# EJS Layout System Documentation

This document describes the EJS templating and layout system used in the Rumfor Market Tracker application.

## Overview

The application uses EJS (Embedded JavaScript) templating with the `express-ejs-layouts` middleware to provide consistent page structure and layout inheritance across all views.

## Layout Structure

### Main Layout (`src/views/layouts/main.ejs`)
The main layout template provides the base HTML structure for all pages:
- HTML5 doctype and basic structure
- Head section with meta tags, title, and CSS/JS includes
- `<%- body %>` placeholder for view-specific content
- Includes header and footer partials

### Header Partial (`src/views/layouts/header.ejs`)
The header partial contains:
- Navigation menu with conditional rendering based on authentication status
- Responsive mobile menu toggle
- CSRF token handling structure for forms
- Branding and logo

### Footer Partial (`src/views/layouts/footer.ejs`)
The footer partial contains:
- Copyright information
- Simple static footer content
- Any footer-specific scripts or links

## View Inheritance Pattern

Individual view files extend the main layout and only contain their specific content:

```ejs
<%- contentFor('body') %>
<!-- View-specific content goes here -->
<%- endContent() %>
```

This pattern ensures:
- Consistent header/footer across all pages
- No redundant HTML structure in individual views
- Easy maintenance of global layout changes
- Proper CSRF token handling in all forms

## Configuration

The layout system is configured in [`src/server.js`](src/server.js):

```javascript
// Set up EJS with layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);
```

## Usage Examples

### Creating a New View
1. Create a new `.ejs` file in `src/views/`
2. Use the contentFor pattern:
```ejs
<%- contentFor('body') %>
<div class="container">
    <h1>My New Page</h1>
    <!-- Page content -->
</div>
<%- endContent() %>
```

### Adding Forms with CSRF Protection
```ejs
<form method="POST" action="/some-endpoint">
    <input type="hidden" name="_csrf" value="<%= csrfToken %>">
    <!-- Form fields -->
    <button type="submit">Submit</button>
</form>
```

## File Structure

```
src/views/
├── layouts/
│   ├── main.ejs      # Main layout template
│   ├── header.ejs    # Header partial
│   └── footer.ejs    # Footer partial
├── index.ejs         # Home page
├── login.ejs         # Login page (uses layout)
├── register.ejs      # Registration page
├── dashboard.ejs     # User dashboard
├── discover.ejs      # Market discovery
├── market.ejs        # Individual market view
├── manage-market.ejs # Market management
└── error.ejs         # Error page
```

## Best Practices

1. **Keep Views Minimal**: Views should only contain their specific content, not full HTML structure
2. **Use Partials**: For reusable components, create partials in the layouts directory
3. **CSRF Protection**: Always include CSRF tokens in forms using the provided pattern
4. **Responsive Design**: Ensure all views work on mobile devices
5. **Accessibility**: Follow accessibility best practices in all templates

## Common Issues

1. **Layout Not Applied**: Ensure the view uses `contentFor('body')` pattern
2. **CSRF Errors**: Verify CSRF token is included in all POST forms
3. **Partial Not Loading**: Check partial path references in main layout

## Migration Guide

When converting existing views to use the layout system:

1. Remove redundant HTML structure (DOCTYPE, html, head, body tags)
2. Wrap content in `contentFor('body')` blocks
3. Ensure forms include CSRF tokens
4. Test that the view renders correctly with the layout

## Related Files

- [`src/server.js`](src/server.js) - Express configuration and layout middleware setup
- [`src/views/layouts/main.ejs`](src/views/layouts/main.ejs) - Main layout template
- [`src/views/layouts/header.ejs`](src/views/layouts/header.ejs) - Header partial
- [`src/views/layouts/footer.ejs`](src/views/layouts/footer.ejs) - Footer partial
- [`src/views/login.ejs`](src/views/login.ejs) - Example view using layout system