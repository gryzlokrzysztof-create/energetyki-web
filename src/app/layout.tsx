import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Ranking Energetyków",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="bg-black text-white min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}