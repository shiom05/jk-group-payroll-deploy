
import Layout from '@/layouts/Layout';;
import { Link } from '@inertiajs/react';

const dashboardArray = [

    {
        name: "Security Management",
        link: "/security-management"

    },
    {
        name: "Leave Management",
        link: "/leave-management"

    },
    {
        name: "Expense Management",
        link: "/expense-management"

    },
    {
        name: "Shift Management",
        link: "/shift-management"

    },
    {
        name: "Inventory Management",
        link: "/inventory-management"

    },
    {
        name: "Payroll Management",
        link: "/payroll-management"

    },

]

export default function Dashboard() {
    return (
        <Layout>
         <div className="min-h-screen flex items-center justify-center p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {dashboardArray.map((item, index) => (
                    <div key={index} className=" bg-gradient-to-r from-gray-100 to-gray-300 p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                        <div className="text-center mb-4">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                            <p className="text-gray-500 text-sm">Click to manage {item.name.toLowerCase()}</p>
                        </div>
                        <Link
                            href={item.link}
                            className="block w-full text-center bg-[rgb(0,21,41)]! text-white! py-2 px-6 rounded-lg text-lg font-medium transition-all"
                        >
                            View
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    </Layout>
    );
}
