'use client'
import React, { useRef } from 'react'
import { useGlobalStats } from '@/hooks/use-stats'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ShieldCheck } from 'lucide-react'

export const StatsBento = () => {
  const sectionRef = useRef<HTMLElement>(null)

  // Reads through the indexer's cached aggregate (PRD §7.7), falling back to
  // a direct on-chain read if the API is unreachable, see useGlobalStats.
  const { data: stats, isPending } = useGlobalStats()

  const total = stats?.totalPairs
  const valid = stats?.validPairs
  const revoked = stats?.revokedPairs
  const loading = isPending || stats === undefined

  // One viewport-height section holding the problem statement and the stats
  // grid, vertically centered. min-h (not a hard h) renders exactly 100vh
  // when the content fits and grows instead of clipping on short screens
  // like tablet landscape or stacked mobile.
  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-background flex flex-col justify-center gap-12 py-16 md:gap-16">
      <TimelineAnimation
        animationNum={0}
        timelineRef={sectionRef}
        className="mx-auto w-full max-w-7xl px-6">
        <Badge variant="secondary">The problem</Badge>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-pretty md:text-4xl lg:text-5xl">
          Every team that deploys its own test wrappers fragments the
          ecosystem.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Zama&apos;s Confidential Token Wrappers Registry already maps each
          ERC-20 to its official ERC-7984 wrapper: one canonical, revocable
          source of truth. Obscura makes it the obvious place to point to:
          browsable, trustworthy, and usable by anyone.
        </p>
      </TimelineAnimation>
      <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 max-w-7xl mx-auto px-6">
        {/* Primary Stat */}
        <TimelineAnimation
          animationNum={1}
          timelineRef={sectionRef}
          className="md:col-span-3 md:row-span-2 bg-card border border-border rounded-3xl p-8 md:p-10 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_10px)] mask-[radial-gradient(ellipse_80%_50%_at_100%_0%,#000_70%,transparent_110%)] pointer-events-none"></div>
          <div>
            {/* accent chip: this theme's dark-mode `secondary` is near-white,
                which would swallow the muted label text */}
            <span className="inline-block px-3 py-1 bg-accent rounded-full text-[10px] font-semibold text-accent-foreground uppercase tracking-widest mb-6">
              Encrypted balances
            </span>
            <h3 className="text-5xl md:text-6xl tracking-tighter text-foreground">100%</h3>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs">
            Every wrapped balance lives on-chain as ERC-7984 ciphertext.
            Amounts stay encrypted end to end, so only the holder can decrypt
            what they own.
          </p>
        </TimelineAnimation>

        {/* Secondary Stat A */}
        <TimelineAnimation
          animationNum={2}
          timelineRef={sectionRef}
          className="md:col-span-3 bg-card rounded-3xl p-8 border border-border flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              Registered pairs
            </p>
            {loading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <p className="text-3xl text-foreground">{total}</p>
            )}
          </div>
          <div className="flex gap-1 items-end h-8">
            {[10, 20, 40, 30, 60, 50, 80, 70, 90, 100, 110].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-primary rounded-full"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </TimelineAnimation>

        {/* Tertiary Stat B */}
        <TimelineAnimation
          animationNum={3}
          timelineRef={sectionRef}
          className="md:col-span-1 bg-card rounded-3xl p-6 border border-border flex flex-col justify-center text-center">
          {loading ? (
            <Skeleton className="mx-auto h-7 w-10" />
          ) : (
            <p className="text-2xl text-foreground">{valid}</p>
          )}
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Valid wrappers
          </p>
        </TimelineAnimation>

        {/* Tertiary Stat C */}
        <TimelineAnimation
          animationNum={4}
          timelineRef={sectionRef}
          className="md:col-span-2 bg-card border border-border rounded-3xl p-6 flex items-center gap-4">
          <div className="size-10 rounded-full bg-background flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="size-5" aria-hidden />
          </div>
          <div>
            {loading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <p className="text-sm text-foreground leading-none">
                {revoked} revoked
              </p>
            )}
            <p className="text-xs font-semibold text-muted-foreground mt-1">
              Read live from the registry on Sepolia
            </p>
          </div>
        </TimelineAnimation>
      </div>
    </section>
  )
}
