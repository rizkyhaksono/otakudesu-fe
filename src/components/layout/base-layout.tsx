import Navbar from "./navbar";
import Footer from "./footer";

import { AppSidebar } from "./app-sidebar"
import {
  SidebarProvider,
  SidebarInset
} from "@/components/ui/sidebar"

export default function BaseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        {children}
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
