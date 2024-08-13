import Navbar from "@/components/Navbar";

const RootLayout = ({ children, onChangeValue } : {children: React.ReactNode, onChangeValue: (value: string) => void }) => {

    return (
        <div>
            <Navbar onSearchChange={(event) => onChangeValue(event)} />
            {children}
        </div>
    );
};

export default RootLayout;

