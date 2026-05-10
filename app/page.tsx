"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import VideoSection from "@/components/organisms/video-section"
import TitleSection from "@/components/organisms/landing-page"
import TitleSectionMobile from "@/components/organisms/landing-page-mobile"
import GuruCard from "@/components/molecules/guru-card"
import GuruCarousel from "@/components/organisms/guru-carousel"
import IntroVideoReveal from "@/components/organisms/intro-video-reveal"
import { useDeviceType } from "@/hooks/use-device-type"
import { getCloudflareImageBiggest } from "@/lib/cdn-assets"
import "@/styles/registration-theme.css"

import PratisthaStory from "@/components/organisms/pratishta-story"
import AashirwadSection from "@/components/organisms/aashirwad-section"
import VideoBackgroundSection from "@/components/organisms/video-background-section"

const gurus = [
  {
    imageId: "dc885005-1573-4b68-9b7d-8d21f2ae8b00",
    name: "Jeevanpran Shree Muktajeevan Swamibapa"
  },
  {
    imageId: "b148858a-2ce9-4ac7-71e9-5bd5e076de00",
    name: "Acharya Shree Purushottampriyadasji Swamishree Maharaj"
  },
  {
    imageId: "e2881864-b5d1-4e12-d289-63add00d1400",
    name: "Acharya Shree Jitendriyapriyadasji Swamiji Maharaj"
  }
]

export default function ShaderShowcase() {
  const targetDate = '2026-08-02T00:00:00';
  const deviceType = useDeviceType();

  const [isLoaded, setIsLoaded] = useState(false)
  const [isPanActive, setIsPanActive] = useState(false)
  const [cardsVisible, setCardsVisible] = useState(false)
  const [mobileGuruVisible, setMobileGuruVisible] = useState(false)
  const sihasanRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const mobileGuruRef = useRef<HTMLDivElement>(null)

  const backgroundImageUrl = `${getCloudflareImageBiggest("5aeb6c7e-f6ea-45b1-da4a-823279172400")}&width=2560`
  const sihasan_trimmed = `${getCloudflareImageBiggest("c7853ba8-25d7-4097-b754-53d5ff3adb00")}&width=2560`

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPanActive(entry.isIntersecting && entry.intersectionRatio >= 0.5)
      },
      { threshold: [0, 0.5, 1] }
    )

    if (sihasanRef.current) {
      observer.observe(sihasanRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setCardsVisible(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    if (cardsRef.current) {
      observer.observe(cardsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setMobileGuruVisible(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    if (mobileGuruRef.current) {
      observer.observe(mobileGuruRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Title section - Scrollable overlay */}
      <div className="relative z-10 bg-slate-900 min-h-screen block">
        <div className="hidden md:block">
          <TitleSection targetDate={targetDate} />
        </div>
        <div className="md:hidden min-h-screen">
          <TitleSectionMobile targetDate={targetDate} />
        </div>
      </div>

      <IntroVideoReveal />

      {/* Video background - Fixed underneath */}
      <div className="z-0 block">
        <VideoBackgroundSection />
      </div>

      {/* Title section - Scrollable overlay */}
      {/* <div className="relative z-10 bg-title-section-bg" style={{ minHeight: '100vh' }}>
            <TitleSection />
          </div>
           */}
      {/* Video reveal spacer */}
      {/* <div className="relative z-10" style={{ minHeight: '125vh' }} /> */}

      <div className="relative z-10 bg-slate-900" style={{ pointerEvents: 'auto' }}>
        {/* Full background Sihasan image section with fade transition */}
        <div ref={sihasanRef} data-section="sihasan" className="w-screen relative overflow-hidden flex flex-col bg-slate-900" style={{ minHeight: '100vh' }}>
          {/* Top gradient overlay for smooth transition from title */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-700/40 to-transparent z-10 pointer-events-none" style={{ height: '40%' }} />

          {/* Bottom gradient overlay for smooth transition to next section */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-700/40 to-transparent z-10 pointer-events-none" style={{ height: '40%', top: 'auto', bottom: 0 }} />

          {/* Glassmorphic overlay for lower section */}
          {/* git <div className="absolute inset-x-0 bottom-0 h-[30%] md:h-[30%] bg-white/45 backdrop-blur-sm z-[5] pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%)' }} /> */}

          {/* Desktop: Static Image (> 1280px) */}
          <img
            src={backgroundImageUrl}
            alt="Background"
            className="hidden xl:block absolute inset-0 w-full h-full object-cover brightness-115"
          />

          {/* Mobile/Tablet: Panning Sihasan Image (<= 1280px, includes iPad Pro) */}
          <img
            src={backgroundImageUrl}
            alt="Background"
            className="xl:hidden absolute inset-0 h-full object-cover animate-pan-right brightness-115"
            style={{
              animationPlayState: isPanActive ? 'running' : 'paused',
              objectPosition: 'left center'
            }}
          />

          {/* Glassmorphic Feature Card */}
          {/* <div className="flex items-end md:items-center justify-center w-full mt-auto relative z-20" style={{ paddingBottom: 'calc(clamp(2.5rem, 8vh, 4rem) + env(safe-area-inset-bottom))' }}>
              <div className="px-4 text-center">
                <h3 className="font-bold leading-[1.4] relative z-10" style={{ color: 'var(--title-section-bg)', fontSize: 'clamp(3rem, 14vw, 12rem)', fontFamily: 'var(--font-gujarati)' }}>સુવર્ણ યુગ નો રજત મહોત્સવ</h3>
              </div>
            </div> */}
        </div>

        {/* Text Sections */}
        <PratisthaStory />


        <div className="bg-main-page-bg">

          {/* Aashirwad Section */}
          <AashirwadSection />

          {/* Staggered Guru Cards */}
          <div ref={mobileGuruRef} className="min-h-screen w-full pb-40 px-4 flex flex-col items-center justify-center">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={mobileGuruVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="section-title"
            >
              Our Beloved Gurus
            </motion.h2>

            {/* Desktop: Staggered layout */}
            <div ref={cardsRef} className="hidden md:flex gap-16 items-end">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={cardsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="translate-y-0"
              >
                <GuruCard imageId={gurus[0].imageId} name={gurus[0].name} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={cardsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
                transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
                className="translate-y-16"
              >
                <GuruCard imageId={gurus[1].imageId} name={gurus[1].name} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={cardsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
                transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
                className="translate-y-32"
              >
                <GuruCard imageId={gurus[2].imageId} name={gurus[2].name} />
              </motion.div>
            </div>

            {/* Mobile: Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={mobileGuruVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="md:hidden w-full"
            >
              <GuruCarousel gurus={gurus} />
            </motion.div>
          </div>

          {/* Video section */}
          <VideoSection />
        </div>
      </div>
    </>
  )
}
