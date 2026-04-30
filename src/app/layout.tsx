import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}