import Footer from "./_components/footer";
import Navbar from "./_components/navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar/>
      <main>{children}</main>
      <Footer />
    </>
  );
}
