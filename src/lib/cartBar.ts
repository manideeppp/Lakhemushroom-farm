/** Routes where the add-to-cart checkout bar may appear (not on home). */
export function isCartBarRoute(pathname: string): boolean {
  if (pathname === '/') return false;
  return (
    /^\/products(\/|$)/.test(pathname) || /^\/training(\/|$)/.test(pathname)
  );
}
