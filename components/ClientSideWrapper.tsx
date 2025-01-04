"use client"

import { ReactNode } from 'react';

interface ClientSideWrapperProps {
    children: ReactNode;
}

export default function ClientSideWrapper({ children }: ClientSideWrapperProps) {
    return <>{children}</>;
} 