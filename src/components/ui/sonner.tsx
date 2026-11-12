import { useTheme } from '@/components/theme-provider'
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      expand={true}
      closeButton={true}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          title: "group-[.toast]:font-semibold group-[.toast]:text-sm",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:mt-1",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90 group-[.toast]:px-3 group-[.toast]:py-2 group-[.toast]:rounded-md group-[.toast]:text-sm group-[.toast]:font-medium",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/80 group-[.toast]:px-3 group-[.toast]:py-2 group-[.toast]:rounded-md group-[.toast]:text-sm",
          closeButton: "group-[.toast]:bg-popover group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted group-[.toast]:hover:text-foreground",
          success: "group-[.toast]:border-l-emerald-500 group-[.toast]:bg-emerald-50/50 dark:group-[.toast]:bg-emerald-950/30 [&_[data-icon]]:text-emerald-600 dark:[&_[data-icon]]:text-emerald-400",
          error: "group-[.toast]:border-l-red-500 group-[.toast]:bg-red-50/50 dark:group-[.toast]:bg-red-950/30 [&_[data-icon]]:text-red-600 dark:[&_[data-icon]]:text-red-400",
          warning: "group-[.toast]:border-l-amber-500 group-[.toast]:bg-amber-50/50 dark:group-[.toast]:bg-amber-950/30 [&_[data-icon]]:text-amber-600 dark:[&_[data-icon]]:text-amber-400",
          info: "group-[.toast]:border-l-blue-500 group-[.toast]:bg-blue-50/50 dark:group-[.toast]:bg-blue-950/30 [&_[data-icon]]:text-blue-600 dark:[&_[data-icon]]:text-blue-400",
        },
        duration: 4000,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
