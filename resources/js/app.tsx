import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
        showSpinner : true
    },
});

//npm run install
//npm run build
//composer run dev
//php artisan make:model Locations  -a 
//php artisan route:list

///php artisan make:model SecurityBlackMark -a 


// php artisan storage:link -> run in prod

// This will set light / dark mode on load...


//---when database migration defined :

//php artisan migrate

initializeTheme();
