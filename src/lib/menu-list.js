import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faBuilding,
  faGraduationCap,
  faCalendarAlt,
  faBook,
  faExchangeAlt,
  faLongArrowAltRight,
  faLongArrowAltLeft,
  faListAlt,
  faChartBar,
  faClipboardList,
  faUsers,
  faFileArchive,
  faInfoCircle,
  faHistory,
  faInfo,
  faFileArrowUp,
  faChartLine,
  faChartPie,
  faSearch,
  faCog,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
} from "lucide-react";

export function getMenuList(pathname) {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/"),
          icon: () => <FontAwesomeIcon icon={faGauge} />,
          submenus: [],
        },
      ],
    },
    // {
    //   groupLabel: "Configuration",
    //   menus: [
    //     {
    //       href: "/sample",
    //       label: "Department",
    //       active: pathname.includes("/sample"),
    //       icon: () => <FontAwesomeIcon icon={faBuilding} />,
    //       submenus: [],
    //     },
    //     {
    //       href: "#",
    //       label: "Program",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faGraduationCap} />,
    //       submenus: [],
    //     },
    //     {
    //       href: "#",
    //       label: "Semester",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faCalendarAlt} />,
    //       submenus: [],
    //     },
    //     {
    //       href: "#",
    //       label: "Curriculum",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faBook} />,
    //       submenus: [],
    //     },
    //     {
    //       href: "#",
    //       label: "Mappings",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faExchangeAlt} />,
    //       submenus: [
    //         {
    //           href: "#",
    //           label: "CO to PO",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faLongArrowAltRight} />,
    //           submenus: [],
    //         },
    //         {
    //           href: "#",
    //           label: "PO to PEO",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faLongArrowAltLeft} />,
    //           submenus: [],
    //         },
    //       ],
    //     },
    //     {
    //       href: "#",
    //       label: "Courses",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faListAlt} />,
    //       submenus: [],
    //     },
    //     {
    //       href: "#",
    //       label: "Outcomes",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faChartBar} />,
    //       submenus: [
    //         {
    //           href: "#",
    //           label: "Course Outcomes",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faClipboardList} />,
    //           submenus: [],
    //         },
    //         {
    //           href: "#",
    //           label: "Program Outcomes",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faClipboardList} />,
    //           submenus: [],
    //         },
    //         {
    //           href: "#",
    //           label: "PEO",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faUsers} />,
    //           submenus: [],
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   groupLabel: "Reports",
    //   menus: [
    //     {
    //       href: "#",
    //       label: "CO Reports",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faChartLine} />,
    //       submenus: [],
    //     },
    //     {
    //       href: "#",
    //       label: "PO Reports",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faChartPie} />,
    //       submenus: [
    //         {
    //           href: "#",
    //           label: "Individual students",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faUser} />,
    //           submenus: [],
    //         },
    //         {
    //           href: "#",
    //           label: "Graduating Cohort",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faGraduationCap} />,
    //           submenus: [],
    //         },
    //         {
    //           href: "#",
    //           label: "Semester Cohort",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faUsers} />,
    //           submenus: [],
    //         },
    //       ],
    //     },
    //     {
    //       href: "#",
    //       label: "PEO Reports",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faFileArchive} />,
    //       submenus: [
    //         {
    //           href: "#",
    //           label: "Survey",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faFileArchive} />,
    //           submenus: [],
    //         },
    //         {
    //           href: "#",
    //           label: "Feedbacks",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faFileArchive} />,
    //           submenus: [],
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      groupLabel: "Course Files",
      menus: [
        {
          href: "/dashboard/courseFiles",
          label: "Course Files",
          active: pathname.includes("/courseFiles"),
          icon: () => <FontAwesomeIcon icon={faFileArrowUp} />,
          submenus: [],
        },
        {
          href: "/dashboard/upload-course-file",
          label: "Course Files (OLD)",
          active: pathname.includes("/upload-course-file"),
          icon: () => <FontAwesomeIcon icon={faFileArrowUp} />,
          submenus: [],
        },
        {
          href: "/dashboard/view-course-files",
          label: "View Course Files",
          active: pathname.includes("/view-course-files"),
          icon: () => <FontAwesomeIcon icon={faSearch} />,
          submenus: [],
        },

        // {
        //   href: "#",
        //   label: "Search by semester",
        //   active: pathname.includes("#"),
        //   icon: () => <FontAwesomeIcon icon={faCalendarAlt} />,
        //   submenus: [],
        // },
      ],
    },
    // {
    //   groupLabel: "CQI",
    //   menus: [
    //     {
    //       href: "#",
    //       label: "Overview",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faInfoCircle} />,
    //       submenus: [],
    //     },
    //     {
    //       href: "#",
    //       label: "Course Level CQI",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faChartBar} />,
    //       submenus: [
    //         {
    //           href: "#",
    //           label: "Process Overview",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faInfo} />,
    //           submenus: [],
    //         },
    //         {
    //           href: "#",
    //           label: "Course Level Feedback History",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faHistory} />,
    //           submenus: [],
    //         },
    //         {
    //           href: "#",
    //           label: "CO Attainment",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faChartPie} />,
    //           submenus: [],
    //         },
    //         {
    //           href: "#",
    //           label: "Individual student's CO Attainment",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faUser} />,
    //           submenus: [],
    //         },
    //         {
    //           href: "#",
    //           label: "CQI Actions and Impacts (Historical Comparison)",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faHistory} />,
    //           submenus: [],
    //         },
    //       ],
    //     },
    //     {
    //       href: "#",
    //       label: "Program Level CQI",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faChartPie} />,
    //       submenus: [
    //         {
    //           href: "#",
    //           label: "Process Overview",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faInfo} />,
    //           submenus: [],
    //         },
    //         {
    //           href: "#",
    //           label: "PO Attainment Reports",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faChartBar} />,
    //           submenus: [
    //             {
    //               href: "#",
    //               label: "Individual students",
    //               active: pathname.includes("#"),
    //               icon: () => <FontAwesomeIcon icon={faUser} />,
    //               submenus: [],
    //             },
    //             {
    //               href: "#",
    //               label: "Graduating Cohort",
    //               active: pathname.includes("#"),
    //               icon: () => <FontAwesomeIcon icon={faGraduationCap} />,
    //               submenus: [],
    //             },
    //             {
    //               href: "#",
    //               label: "Semester Cohort",
    //               active: pathname.includes("#"),
    //               icon: () => <FontAwesomeIcon icon={faUsers} />,
    //               submenus: [],
    //             },
    //             {
    //               href: "#",
    //               label: "CQI Action and Impacts (Action required)",
    //               active: pathname.includes("#"),
    //               icon: () => <FontAwesomeIcon icon={faChartBar} />,
    //               submenus: [],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       href: "#",
    //       label: "Department Level",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faBuilding} />,
    //       submenus: [
    //         {
    //           href: "#",
    //           label: "CQI Actions and Impacts",
    //           active: pathname.includes("#"),
    //           icon: () => <FontAwesomeIcon icon={faChartBar} />,
    //           submenus: [],
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   groupLabel: "Settings",
    //   menus: [
    //     {
    //       href: "#",
    //       label: "General Settings",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faCog} />,
    //       submenus: [],
    //     },
    //     {
    //       href: "#",
    //       label: "Account Settings",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faUser} />,
    //       submenus: [],
    //     },
    //     {
    //       href: "#",
    //       label: "User Management",
    //       active: pathname.includes("#"),
    //       icon: () => <FontAwesomeIcon icon={faUsers} />,
    //       submenus: [],
    //     },
    //   ],
    // },
  ];
}
