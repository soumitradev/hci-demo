import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import NavigationMenu from '@/components/NavigationMenu'
import Header from '@/components/Header'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className='max-w-sm px-3 mx-auto pb-16'>
        <Header />
        <Outlet />
        <NavigationMenu />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})
