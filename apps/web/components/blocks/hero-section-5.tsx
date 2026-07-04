'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronRight, EyeOff } from 'lucide-react'
import { useScroll, motion } from 'motion/react'

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            {/* a div, not <main>: the marketing layout owns the single main
                landmark so the sections after the hero are inside it too */}
            <div className="overflow-x-hidden">
                {/* relative so the inset-1 backdrop frame wraps the hero content
                    instead of the viewport — keeps the buttons inside the frame */}
                <section className="relative min-h-screen">
                    <div className="py-24 md:pb-32 lg:pb-36 lg:pt-72">
                        <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-semibold tracking-tight md:text-6xl lg:mt-16 xl:text-7xl">Move value privately on Ethereum</h1>
                                <p className="mt-8 max-w-2xl text-balance text-lg">Every confidential token wrapper on Sepolia in one place. Browse the registry, wrap ERC-20s into encrypted ERC-7984 tokens, and decrypt balances only you can see.</p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-12 rounded-full pl-5 pr-3 text-base">
                                        <Link href="/registry">
                                            <span className="text-nowrap">Explore the registry</span>
                                            <ChevronRight className="ml-1" />
                                        </Link>
                                    </Button>
                                    {/* rely on the ghost variant's own hover:bg-accent
                                        instead of the template's hardcoded
                                        zinc-950/white tint — those two hover
                                        backgrounds conflict at the same
                                        specificity in dark mode and the wrong
                                        one can win, making hover look dead */}
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-12 rounded-full px-5 text-base">
                                        <Link href="/developers">
                                            <span className="text-nowrap">Build with it</span>
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {/* no aspect-ratio classes: with all four insets set, the
                            browser would keep the aspect height and ignore bottom,
                            letting content overflow the frame on short viewports */}
                        <div className="absolute inset-1 overflow-hidden rounded-3xl border border-black/10 lg:rounded-[3rem] dark:border-white/5">
                            {/* crossOrigin: the app ships COEP require-corp headers
                                (Relayer SDK WASM); cross-origin media must be fetched
                                in CORS mode or the browser blocks it */}
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                crossOrigin="anonymous"
                                className="size-full object-cover opacity-50 invert dark:opacity-35 dark:invert-0 dark:lg:opacity-75"
                                src="https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477"></video>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

const menuItems = [
    { name: 'Registry', href: '/registry' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Faucet', href: '/faucet' },
    { name: 'Activity', href: '/activity' },
    { name: 'Developers', href: '/developers' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const { scrollYProgress } = useScroll()

    React.useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.05)
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    return (
        <header>
            <nav
                aria-label="Main"
                data-state={menuState && 'active'}
                className="group fixed z-20 w-full pt-2">
                <div className={cn('mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12', scrolled && 'bg-background/50 backdrop-blur-2xl')}>
                    <motion.div
                        key={1}
                        className={cn('relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6', scrolled && 'lg:py-4')}>
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer rounded-md p-2.5 hover:bg-accent lg:hidden">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            {/* close the mobile menu on navigation —
                                                client-side routing otherwise leaves
                                                the panel open over the new page */}
                                            <Link
                                                href={item.href}
                                                onClick={() => setMenuState(false)}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm">
                                    <Link href="/developers">
                                        <span>Docs</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm">
                                    <Link href="/registry">
                                        <span>Launch app</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </nav>
        </header>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <span className={cn('flex items-center gap-2', className)}>
            <EyeOff className="size-5" aria-hidden />
            <span className="text-lg font-semibold tracking-tight">Obscura</span>
        </span>
    )
}
