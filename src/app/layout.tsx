import './globals.css'
import { Poppins } from 'next/font/google'
import { Providers } from '@/Store/Provider'
import 'react-toastify/dist/ReactToastify.css';

const poppin = Poppins({
  weight: ['100', '400'],
  subsets: ['latin'],
})


export const metadata = {
  title: 'EMPORIUM',
  description: 'Emporium is a platform for buying fitness products online',
  authors: [{ name: "Vishal Chincholi", url: 'https://vishalchincholi.vercel.app/' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) { 
  return (
    <html lang="en">
      <body className={poppin.className}>
        <Providers>
          {children}
        </Providers>
      </body>

    </html>
  )
}
