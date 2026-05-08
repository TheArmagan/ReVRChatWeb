export type IRoute = {
  title: string;
  component: () => Promise<{ default: any }>;
};

export type ICurrentRoute = {
  route: string;
  params: Record<string, string>;
  query: Record<string, string>;
  component: any;
  data: any;
};

function matchRoute(pathname: string): { config: IRoute; params: Record<string, string> } | null {
  for (const [pattern, config] of Object.entries(routes)) {
    const paramNames: string[] = [];
    const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const match = pathname.match(new RegExp(`^${regexStr}$`));
    if (match) {
      const params = Object.fromEntries(paramNames.map((name, i) => [name, match[i + 1]]));
      return { config, params };
    }
  }
  return null;
}

const routes: Record<string, IRoute> = {
  "/": {
    title: "Landing",
    component: () => import("../pages/Landing.svelte")
  },
  "/not-found": {
    title: "404 - Not Found",
    component: () => import("../pages/NotFound.svelte")
  },
  "/home": {
    title: "Home",
    component: () => import("../pages/App.svelte")
  }
}

const state = $state<{ currentRoute: ICurrentRoute }>({
  currentRoute: {
    route: window.location.host === "vrchat.com" ? "/home" : "/",
    params: {},
    query: {},
    component: null,
    data: null
  }
});

export function buildUrl(route: string, params: Record<string, string> = {}): string {
  const url = new URL(route, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.pathname + url.search;
}

let isInitialized = false;

const onNavigate = async () => {
  const pathname = window.location.pathname;
  const queryParams = Object.fromEntries(new URLSearchParams(window.location.search).entries());
  const matched = matchRoute(pathname);
  console.log("Navigating to:", pathname);

  if (matched) {
    const componentModule = await matched.config.component();
    state.currentRoute = {
      route: pathname,
      params: matched.params,
      query: queryParams,
      component: componentModule.default,
      data: null
    };
    document.body.title = `${matched.config.title} - ReVRChatWeb`;
  } else {
    navigateTo("/not-found", { route: pathname });
  }
};

const onHoverElement = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const preloadElement = target.closest("[data-preload]") as HTMLElement | null;
  if (preloadElement) {
    const route = preloadElement.getAttribute("data-preload");
    if (route && routes[route]) {
      routes[route].component();
    }
  }
}

export const navigateTo = (route: string, params: Record<string, string> = {}) => {
  window.history.pushState({}, "", buildUrl(route, params));
  onNavigate();
};

export function initRouter(): void {
  if (isInitialized) return;
  isInitialized = true;

  window.addEventListener('popstate', onNavigate);
  window.addEventListener('mouseover', onHoverElement);
  onNavigate();
}

export function destroyRouter(): void {
  if (!isInitialized) return;
  isInitialized = false;

  window.removeEventListener('popstate', onNavigate);
  window.removeEventListener('mouseover', onHoverElement);
}

export const router = {
  get currentRoute() {
    return state.currentRoute;
  },
  routes,
  navigateTo
}
