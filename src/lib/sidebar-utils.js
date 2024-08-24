export function processSidebarItems(items, pathname) {
  return Object.entries(items).map(([key, item]) => {
    const hasChildren = item.children && Object.keys(item.children).length > 0;
    return {
      href: item.href || "",
      label: item.text,
      active: pathname.includes(item.href),
      icon: item.icon,
      submenus: hasChildren ? processSidebarItems(item.children, pathname) : [],
    };
  });
}
