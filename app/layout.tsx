export const metadata = {
  title: 'Instagram Auto-Responder',
  description: 'Bot de réponse automatique Instagram',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
