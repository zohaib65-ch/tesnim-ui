import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between p-4 md:p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">T</div>
          <span className="text-xl font-bold text-foreground">Tesnim</span>
        </Link>
        <ModeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} tesnim. All rights reserved.</p>
      </footer>
    </div>
  );
};
