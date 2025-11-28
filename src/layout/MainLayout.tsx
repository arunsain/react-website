import React  from "react";

import type {ReactNode} from "react"
import Navbar from "../components/Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return <><Navbar/>{children}</>;
};

export default MainLayout;
