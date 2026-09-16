import type { ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'accent' | 'glass'
type Size = 'sm' | 'md' | 'lg'

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-12 px-7 text-base',
}

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--primary)] text-[var(--primary-ink)] hover:bg-[var(--primary-hover)] shadow-[0_6px_18px_var(--shadow)]',
  accent:
    'bg-[var(--accent)] text-[var(--accent-ink)] hover:brightness-110 shadow-[0_6px_18px_var(--shadow)]',
  outline:
    'border border-[var(--primary)] text-[var(--primary)] bg-transparent hover:bg-[var(--primary)] hover:text-[var(--primary-ink)]',
  /* Sits over photography or an animated backdrop: frosted so what is behind
     reads through, ringed so the edge stays legible against light, dark and
     busy areas alike. The frosting is a theme token, not a fixed white, so a
     night palette gets a dark pane instead of a milky one. */
  glass:
    'bg-[var(--glass)] text-[var(--primary)] backdrop-blur-md ring-1 ring-[var(--glass-ring)] shadow-[0_4px_16px_var(--shadow)] hover:bg-[var(--surface)] hover:ring-[var(--primary)]',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
}: {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold',
        'transition-all duration-200 ease-out active:scale-[0.98] cursor-pointer',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        sizes[size],
        variants[variant],
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
