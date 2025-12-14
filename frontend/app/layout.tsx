export const metadata = {
  title: 'Contracts Demo',
  description: 'Next + Nest + ts-rest contracts demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', margin: 24 }}>
        {children}
      </body>
    </html>
  );
}
