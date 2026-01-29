import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { auth } from "@/lib/auth";
import { Home, Inbox, Calendar, Search, Settings, Phone } from "lucide-react";
type Session = typeof auth.$Infer.Session;
// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Calls",
    url: "/",
    icon: Phone,
  },
//   {
//     title: "Calendar",
//     url: "#",
//     icon: Calendar,
//   },
//   {
//     title: "Search",
//     url: "#",
//     icon: Search,
//   },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

const AppSidebar = ({session}: {session: Session | null}) => {
    return ( 
      <>
        
        {session && (<Sidebar>
      <SidebarContent>
        <SidebarTrigger/>
        <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>)}
</>

     );
}
 
export default AppSidebar;