/**
 * Myrimaven SPA Router
 * Simple hash-based router for single-page navigation.
 */

export class Router {
  constructor(app) {
    this.app = app;
    this.routes = {};
    this.currentRoute = null;

    window.addEventListener('hashchange', () => this.resolve());
    window.addEventListener('load', () => this.resolve());
  }

  on(route, handler) {
    this.routes[route] = handler;
    return this;
  }

  navigate(route) {
    window.location.hash = route;
  }

  resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, ...paramParts] = hash.split('/').filter(Boolean);
    const route = '/' + (path || '');
    const params = paramParts;

    // Find matching route
    let handler = this.routes[route];
    if (!handler) {
      // Try matching parameterized routes
      for (const [routePath, routeHandler] of Object.entries(this.routes)) {
        if (routePath.includes(':')) {
          const routeParts = routePath.split('/').filter(Boolean);
          if (routeParts.length <= params.length + 1 && routeParts[0] === path) {
            handler = routeHandler;
            break;
          }
        }
      }
    }

    if (!handler) handler = this.routes['/'] || (() => {});

    this.currentRoute = route;
    this.updateNav(route);
    handler(this.app, params);

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateNav(route) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      if (linkRoute === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
