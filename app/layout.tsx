import './globals.css'
import Header from './components/Header'

export const metadata = {
  title: 'Order Management System',
  description: 'Manage your orders efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
