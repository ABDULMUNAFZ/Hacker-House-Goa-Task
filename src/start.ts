import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Custom lightweight CSRF middleware to prevent packaging import failures on Vercel Node runtime.
// Re-adds protection for server functions against cross-site requests.
const csrfMiddleware = createMiddleware().server(async (ctx) => {
  if (ctx.request.method === "POST" && ctx.handlerType === "serverFn") {
    const origin = ctx.request.headers.get("Origin");
    const referer = ctx.request.headers.get("Referer");
    const requestUrl = new URL(ctx.request.url);

    if (origin) {
      if (origin !== requestUrl.origin) {
        return new Response("Forbidden (CSRF validation failed)", { status: 403 });
      }
    } else if (referer) {
      if (!referer.startsWith(requestUrl.origin)) {
        return new Response("Forbidden (CSRF validation failed)", { status: 403 });
      }
    }
  }
  return ctx.next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
