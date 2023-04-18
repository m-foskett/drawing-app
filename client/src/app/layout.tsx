import './globals.css'

export const metadata = {
  title: 'Drawing App',
  description: 'A simple drawing application.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
