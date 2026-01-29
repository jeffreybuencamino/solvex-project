'use client'

// === IMPORTS ===
import { useTheme } from "next-themes";
import { LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "./ui/sidebar";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/auth";
import { signOut } from "@/lib/actions/auth-actions";

// === IMPORTS ===

type Session = typeof auth.$Infer.Session;

type NavbarProps = {
  session: Session | null;
}
const Navbar = ({session}: NavbarProps) => {
    const { setTheme } = useTheme()
    const pathname = usePathname();
    const isActive = (path: string) => {
    return pathname === path;
  };

    return ( 
        <nav className="p-4 flex items-center justify-between bg-gray-800">
            {/* LEFT */}
            {session && <SidebarTrigger/>}
            

            {/* RIGHT */}
            <div className="flex items-center gap-4">
            {!session && <Link className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-indigo-600 bg-indigo-50"
              }`} href="/">Home</Link>}
            {session && (<Link href="/dashboard">Dashboard</Link>)}
            {!session && (<Link className="text-amber-50" href="/auth">Sign in</Link>)}
            {/* LIGHT/DARK TOGGLE */}
            <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
            


            {/* AVATAR ICON W/ DROPDOWN MENU */}
            {session && (<DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href='/dashboard/profile'>Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href='/dashboard/billing'>Billing</Link></DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      
                        <button onClick={signOut} className="flex w-full items-center gap-2"><LogOut/>Logout</button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>)}

            </div>
        </nav>
     );
}
 
export default Navbar;