import Navbar from "@/components/Navbar";

const RootLayout = ({ children } : {children: React.ReactNode}) => {

    return (
        <div className="h-full">
            <Navbar />
            <main className="mt-20">
                {children}
            </main>
        </div>
    );
};

export default RootLayout;

