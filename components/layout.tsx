import Navbar from "@/components/Navbar";

const RootLayout = ({ children, search } : {children: React.ReactNode, search?:boolean}) => {

    return (
        <div className="h-full">
            <Navbar search={search}/>
            <main className="mt-20">
                {children}
            </main>
        </div>
    );
};

export default RootLayout;

