import { useAuthStore } from '@/store/auth';
import { useEffect, useState } from 'react';

export const useAppInit = () => {
    const [isReady, setReady] = useState(false);
    const rehydrate = useAuthStore((s) => s.rehydrate);

    useEffect(() => {
        const init = async () => {
            await rehydrate();
            setReady(true);
        };
        init();
    }, []);

    return isReady;
};
