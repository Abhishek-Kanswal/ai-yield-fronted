'use client'

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface AvatarDecorationProps {
    value?: string
    backgroundColor?: string
    badgeColor?: string
    children?: React.ReactNode
}

export function AvatarDecoration({
    value = "1600",
    backgroundColor = "#2d3748",
    badgeColor,
    children,
}: AvatarDecorationProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    // Function to get color based on score
    const getColorByScore = (score: number): string => {
        if (score < 800) return "#B72B38"
        if (score < 1200) return "#C29010"
        if (score < 1400) return "#C1C0B6"
        if (score < 1600) return "#7C8DA8"
        if (score < 1800) return "#4E86B9"
        if (score < 2000) return "#B48713"
        if (score < 2200) return "#427B56"
        if (score < 2400) return "#127F31"
        if (score < 2600) return "#836DA6"
        return "#7A5EAF"
    }

    const scoreValue = parseInt(value, 10) || 0
    const borderColor = getColorByScore(scoreValue)
    const finalBadgeColor = badgeColor || borderColor

    useEffect(() => {
        if (!containerRef.current) return

        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect()
                setDimensions({ width, height })
            }
        }

        // Initial measurement
        updateDimensions()

        // Update on resize
        const resizeObserver = new ResizeObserver(updateDimensions)
        resizeObserver.observe(containerRef.current)

        return () => resizeObserver.disconnect()
    }, [])

    const borderWidth = 4
    const gap = 8 // Space between avatar and decoration
    const borderRadius = 16 // Rounded corners
    const innerWidth = dimensions.width - borderWidth * 2 - gap * 2
    const innerHeight = dimensions.height - borderWidth * 2 - gap * 2

    return (
        <div
            ref={containerRef}
            className="relative inline-block"
            style={{
                minWidth: 100,
                minHeight: 100,
            }}
        >
            {/* Rounded rectangular border frame */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    border: `${borderWidth}px solid ${borderColor}`,
                    borderRadius: borderRadius,
                }}
            />

            {/* Dark background rounded rectangle */}
            <div
                className="absolute flex items-center justify-center overflow-hidden"
                style={{
                    top: borderWidth + gap,
                    left: borderWidth + gap,
                    width: innerWidth > 0 ? innerWidth : 0,
                    height: innerHeight > 0 ? innerHeight : 0,
                    backgroundColor,
                    borderRadius: borderRadius - gap,
                }}
            >
                {dimensions.width > 0 && children}
            </div>

            {/* Badge at bottom */}
            <div
                className="absolute left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-sm font-semibold whitespace-nowrap"
                style={{
                    bottom: -12,
                    backgroundColor: finalBadgeColor,
                }}
            >
                {value}
            </div>
        </div>
    )
}