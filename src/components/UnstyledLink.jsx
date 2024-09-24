// import clsx from "clsx"
// import Link from "next/link"

// export default function UnstyledLink({
//   children,
//   href,
//   openNewTab = undefined,
//   className,
//   ...rest
// }) {
//   const isNewTab =
//     openNewTab !== undefined
//       ? openNewTab
//       : href && !href.startsWith("/") && !href.startsWith("#")

//   if (!isNewTab) {
//     return (
//       <Link href={href} legacyBehavior>
//         <a {...rest} className={className}>
//           {children}
//         </a>
//       </Link>
//     );
//   }

//   return (
//     <a
//       target="_blank"
//       rel="noopener noreferrer"
//       href={href}
//       {...rest}
//       className={clsx(className, "cursor-[ne-resize]")}
//     >
//       {children}
//     </a>
//   )
// }

import clsx from "clsx";
import Link from "next/link";

export default function UnstyledLink({
  children,
  href,
  openNewTab = undefined,
  className,
  onClick,
  disabled= false,
  ...rest
}) {
  const isNewTab =
    openNewTab !== undefined
      ? openNewTab
      : href && !href.startsWith("/") && !href.startsWith("#");

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    if (!href) {
      e.preventDefault();
    }
  };

  if (!isNewTab) {
    return (
      <Link href={href || "#"} legacyBehavior>
        <a {...rest} className={className} onClick={handleClick}>
          {children}
        </a>
      </Link>
    );
  }

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      {...rest}
      className={clsx(className, "cursor-[ne-resize]")}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
