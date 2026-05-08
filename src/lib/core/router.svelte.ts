export type IRoute = {
  title: string;
  component: () => Promise<{ default: any }>;
};

export type ICurrentRoute = {
  route: string;
  params: Record<string, string>;
  component: any;
  data: any;
};

const routes: Record<string, IRoute> = {
  "/": {
    title: "Home",
    component: () => import("../pages/Landing.svelte")
  },
  "/404": {
    title: "404 - Not Found",
    component: () => import("../pages/404.svelte")
  },
  "/home": {
    title: "404 - Not Found",
    component: () => import("../pages/Home.svelte")
  }
}

const state = $state<{ currentRoute: ICurrentRoute }>({
  currentRoute: {
    route: window.location.host === "vrchat.com" ? "/home" : "/",
    params: {},
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
  const route = window.location.pathname;
  const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
  const routeConfig = routes[route];
  console.log("Navigating to:", route, "with params:", params);

  if (routeConfig) {
    const componentModule = await routeConfig.component();
    state.currentRoute = {
      route,
      params,
      component: componentModule.default,
      data: null
    };
  } else {
    navigateTo("/404", { route });
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
