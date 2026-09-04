"use client"

import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"

import { cn } from "@/lib/utils"

function NavigationMenu({ className, ...props }: NavigationMenuPrimitive.Root.Props) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn("relative", className)}
      {...props}
    />
  )
}

function NavigationMenuList({ className, ...props }: NavigationMenuPrimitive.List.Props) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex list-none items-center gap-1", className)}
      {...props}
    />
  )
}

function NavigationMenuItem({ ...props }: NavigationMenuPrimitive.Item.Props) {
  return <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" {...props} />
}

function NavigationMenuTrigger({ ...props }: NavigationMenuPrimitive.Trigger.Props) {
  return <NavigationMenuPrimitive.Trigger data-slot="navigation-menu-trigger" {...props} />
}

function NavigationMenuContent({ className, ...props }: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn("p-1", className)}
      {...props}
    />
  )
}

function NavigationMenuLink({ className, ...props }: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "block cursor-default rounded-md px-1.5 py-1 text-sm whitespace-nowrap outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent data-[active]:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuPortal({ ...props }: NavigationMenuPrimitive.Portal.Props) {
  return <NavigationMenuPrimitive.Portal data-slot="navigation-menu-portal" {...props} />
}

function NavigationMenuPositioner({
  className,
  align = "start",
  sideOffset = 4,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Positioner
      data-slot="navigation-menu-positioner"
      className={cn("z-50 outline-none", className)}
      align={align}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function NavigationMenuPopup({ className, ...props }: NavigationMenuPrimitive.Popup.Props) {
  return (
    <NavigationMenuPrimitive.Popup
      data-slot="navigation-menu-popup"
      className={cn(
        "w-96 origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none transition-[opacity,transform] duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({ className, ...props }: NavigationMenuPrimitive.Viewport.Props) {
  return (
    <NavigationMenuPrimitive.Viewport
      data-slot="navigation-menu-viewport"
      className={cn("relative", className)}
      {...props}
    />
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuPopup,
  NavigationMenuViewport,
}
