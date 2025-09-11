import { defineMiddleware } from "astro:middleware";
import { validateToken } from "./utils/isValidToken";

const protectedRoutes = ["/"];
const publicRoutes = ["/login", "/signup"];

export const onRequest = defineMiddleware(async (context, next) => {

    const authToken = context.cookies.get("token")?.value;
    const { pathname } = context.url;
    
    const isProtectedRoute = protectedRoutes.includes(pathname);
    const isPublicRoute = publicRoutes.includes(pathname);
    
    let isValidToken = false;

    if (authToken) {

        isValidToken = await validateToken(authToken);
        if (!isValidToken) {
            context.cookies.delete("token");
        };

    }
    
    const hasValidAuth = authToken && isValidToken;
    
    if (!hasValidAuth && isProtectedRoute) {
        return context.redirect("/login");
    }

    if (hasValidAuth && isPublicRoute && pathname !== "/") {
        return context.redirect("/");
    }
    
    return next();
	
});