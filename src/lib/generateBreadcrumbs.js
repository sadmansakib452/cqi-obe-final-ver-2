import Link from "next/link";

export function findBreadcrumbPath(menuList, pathname, path = []) {
  for (const menu of menuList) {
    if (menu.href === pathname) {
      return [...path, { label: menu.label, href: menu.href }];
    }

    if (menu.submenus && menu.submenus.length > 0) {
      const foundPath = findBreadcrumbPath(menu.submenus, pathname, [
        ...path,
        { label: menu.label, href: menu.href },
      ]);
      if (foundPath.length > 0) return foundPath;
    }
  }
  return [];
}

export function generateBreadcrumbs(menuList) {
  const router = useRouter()
  const pathname = router.pathname;

  const breadcrumbPath = findBreadcrumbPath(menuList, pathname);

  return breadcrumbPath;
}
