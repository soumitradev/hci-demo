import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import NavigationMenu from '@/components/NavigationMenu'
import Header from '@/components/Header'

export const Route = createRootRoute({
  component: () => {
    const pathname = useLocation({
      select: (location) => location.pathname
    });
    return <>
      <div className='max-w-sm px-3 mx-auto pb-16'>
        {pathname !== '/' && <Header />}
        <Outlet />
        {pathname !== '/' && <NavigationMenu />}
      </div>
      <TanStackRouterDevtools />
    </>
  }
})
