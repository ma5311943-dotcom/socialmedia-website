'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

export default function NavObserver({ children }) {
    return (
        <Suspense fallback={null}>
            <NavContent>{children}</NavContent>
        </Suspense>
    );
}

function NavContent({ children }) {
    const pathname = usePathname();
    return children;
}
