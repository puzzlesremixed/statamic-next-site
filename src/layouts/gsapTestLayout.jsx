"use client";

import {forwardRef} from "react";
import GsapTestingPage from "@/components/GsapTestComponent";

const GsapTestingLayout = forwardRef(
    ({children}, ref) => {
        return <GsapTestingPage ref={ref}>{children}</GsapTestingPage>;
    }
);

export default GsapTestingLayout;
