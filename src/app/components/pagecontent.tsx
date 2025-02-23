'use client'
import React from "react";

export const PageContent: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return (
        <div className="font-sans-serif font-bold h-full" style={{marginTop:'calc(100vh - (100vh - 64px)', overflowY: 'scroll'}}>
            {children}
        </div>
    )
}