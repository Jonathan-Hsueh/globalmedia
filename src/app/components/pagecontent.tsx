import React from "react";

export const PageContent: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return (
        <div className="font-sans font-bold h-full" style={{height: 'calc(100vh - 64px)', overflowY: 'scroll'}}>
            {children}
        </div>
    )
}