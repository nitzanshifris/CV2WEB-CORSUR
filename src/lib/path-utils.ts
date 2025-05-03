interface PathOptions {
  base?: string;
  trailingSlash?: boolean;
}

export function joinPaths(...paths: string[]): string {
  return paths
    .map((path) => path.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
}

export function normalizePath(path: string, options: PathOptions = {}): string {
  const { base = "", trailingSlash = false } = options;

  let normalized = path.replace(/\\/g, "/").replace(/\/+/g, "/");

  if (base) {
    normalized = joinPaths(base, normalized);
  }

  if (trailingSlash && !normalized.endsWith("/")) {
    normalized += "/";
  } else if (!trailingSlash && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

export function getPathSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

export function getPathDepth(path: string): number {
  return getPathSegments(path).length;
}

export function getPathParent(path: string): string {
  const segments = getPathSegments(path);
  segments.pop();
  return segments.join("/");
}

export function getPathBasename(path: string): string {
  return path.split("/").pop() || "";
}

export function getPathExtension(path: string): string {
  const basename = getPathBasename(path);
  const dotIndex = basename.lastIndexOf(".");
  return dotIndex === -1 ? "" : basename.slice(dotIndex + 1);
}

export function isAbsolutePath(path: string): boolean {
  return path.startsWith("/") || /^[A-Za-z]:\\/.test(path);
}

export function isRelativePath(path: string): boolean {
  return !isAbsolutePath(path);
}

export function resolvePath(path: string, base: string): string {
  if (isAbsolutePath(path)) {
    return path;
  }

  return joinPaths(base, path);
}

export function isSubPath(path: string, parent: string): boolean {
  const normalizedPath = normalizePath(path);
  const normalizedParent = normalizePath(parent);

  return normalizedPath.startsWith(normalizedParent + "/");
}

export function getRelativePath(from: string, to: string): string {
  const fromSegments = getPathSegments(from);
  const toSegments = getPathSegments(to);

  let i = 0;
  while (
    i < fromSegments.length &&
    i < toSegments.length &&
    fromSegments[i] === toSegments[i]
  ) {
    i++;
  }

  const up = fromSegments.slice(i).map(() => "..");
  const down = toSegments.slice(i);

  return [...up, ...down].join("/");
}

export function matchPath(
  path: string,
  pattern: string | RegExp
): boolean {
  if (typeof pattern === "string") {
    return path === pattern;
  }

  return pattern.test(path);
}

export function matchPathPattern(
  path: string,
  pattern: string
): boolean {
  const regex = new RegExp(
    "^" +
      pattern
        .replace(/:[^/]+/g, "([^/]+)")
        .replace(/\*/g, ".*")
        .replace(/\?/g, "\\?") +
      "$"
  );

  return regex.test(path);
} 