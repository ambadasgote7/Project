// File: src/layouts/FacultyLayout.jsx
import { Outlet } from "react-router-dom";
import FacultyNavBar from "../components/navbars/FacultyNavBar";


const CollegeLayout = () => (
<div className="min-h-screen flex flex-col">
<ComapnyNavBar />
<main className="flex-1 p-4">
<Outlet />
</main>
</div>
);


export default CollegeLayout;