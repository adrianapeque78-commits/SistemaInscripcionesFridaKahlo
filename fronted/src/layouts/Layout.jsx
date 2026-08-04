import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import "../styles/Layout.css";
function Layout() {
  return (
    <div className="layout">

      <Sidebar />

      <main className="layout-content">

        <Header />

        <Outlet />

      </main>

    </div>
  );
}

export default Layout;