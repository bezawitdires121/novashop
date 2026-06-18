import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/cart/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NovaShop : Premium eCommerce",
    template: "%s | NovaShop",
  },
  description: "Discover premium products at unbeatable prices.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <Navbar />
            <CartDrawer />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#16161f",
                  color: "#f8f8fc",
                  border: "1px solid #1e1e2e",
                },
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}