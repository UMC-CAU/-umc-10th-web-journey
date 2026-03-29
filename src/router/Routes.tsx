import { 
  useMemo, 
  Children, 
  cloneElement, 
  isValidElement, 
  type FC, 
  type ReactElement 
} from "react";
import { Route } from "./Route";
import { useCurrentPath } from "./hook";
import type { RoutesProps } from "./types"
import type { RouteProps } from "react-router";

// Routes.tsx
export const Routes: FC<RoutesProps> = ({ children }) => {
  const currentPath = useCurrentPath();

  const isRouteElement = (child: any): child is ReactElement<RouteProps> => {
    return isValidElement(child) && child.type === Route;
  };
  
  const activeRoute = useMemo(() => {
    const routes = Children.toArray(children).filter(isRouteElement);
    return routes.find((route) => route.props.path === currentPath);
  }, [children, currentPath]);

  if (!activeRoute) return null;
  return cloneElement(activeRoute);
};