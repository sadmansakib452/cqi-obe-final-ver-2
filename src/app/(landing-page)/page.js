import Image from "next/image";
import HeroHeader from "./_components/hero";
import FeatureCards from "./_components/feature-cards";
import Features from "./_components/features";

export default function HomePage() {
  return (
    <>
    <HeroHeader />
    <FeatureCards />
    <Features />
    </>
  );
}
