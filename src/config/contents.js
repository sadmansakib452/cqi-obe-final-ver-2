import featuresImage from '../../public/features-img.webp'
/* ====================
[> CUSTOMIZING CONTENT <]
-- Setup image by typing `/image-name.file` (Example: `/header-image.jpg`)
-- Add images by adding files to /public folder
-- Leave blank `` if you don't want to put texts or images
 ==================== */

// export const heroHeader = {
//   header: `Landing pages made easy`,
//   subheader: `Easy to setup. Customizable. Quick. Responsive.`,
//   image: `/hero-img.webp`,
// }

export const heroHeader = {
  header: "Transforming Education with CQI for OBE",
  subheader:
    "Enhancing Learning Outcomes through Continuous Quality Improvement",
  image: `/hero-img.webp`, // Replace with your image path
};



export const featureCards = {
  header: "Key Features",
  subheader: "Powering Education with Advanced Analytics and Reporting",
  content: [
    {
      icon: "nextjs", // Replace with the actual icon key
      text: "Data-Driven Insights",
      subtext:
        "Leverage real-time analytics to measure and improve student performance across courses.",
    },
    {
      icon: "shadcnUi", // Replace with the actual icon key
      text: "Customizable Assessments",
      subtext:
        "Design and implement assessments that align with your program's specific outcomes.",
    },
    {
      icon: "vercel", // Replace with the actual icon key
      text: "Comprehensive Reporting",
      subtext:
        "Generate detailed reports on CO and PO achievements for continuous improvement.",
    },
  ],
};




export const features = {
  header: "Why Choose Our CQI for OBE Solution?",
  subheader: "Unlock the full potential of Outcome-Based Education",
  content: [
    {
      icon: "fileSearch", // Replace with the actual icon key
      text: "Seamless Integration",
      subtext:
        "Easily integrate with existing academic systems to streamline processes.",
    },
    {
      icon: "barChart", // Replace with the actual icon key
      text: "User-Friendly Interface",
      subtext:
        "Intuitive design that simplifies the management of educational outcomes.",
    },
    {
      icon: "settings", // Replace with the actual icon key
      text: "Expert Support",
      subtext:
        "Access to a team of experts dedicated to helping you achieve your educational goals.",
    },
    {
      icon: "settings", // Replace with the actual icon key
      text: "Robust Security",
      subtext:
        "Protect sensitive student data with our advanced security protocols.",
    },
  ],
  image: "/features-img.webp", // Replace with your image path
};
