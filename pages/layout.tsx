import Navbar from "@/components/Navbar";
import React, { useState } from "react";

const RootLayout = ({ children, onChangeValue } : {children: React.ReactNode, onChangeValue: (value: string) => void }) => {


    const handleSearchChange = (value: string) => {
        onChangeValue(value)
    }

    return (
        <div>
            <Navbar onSearchChange={handleSearchChange} />
            {children}
        </div>
    );
};

export default RootLayout;

