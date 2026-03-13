import { useCallback, useRef, useEffect } from 'react'
import { usePDPConfig } from '../../context/PDPConfigContext'
import PDPHeader from './PDPHeader'
import ProductVisualizer from './ProductVisualizer'
import SectionProgressDots from './SectionProgressDots'
import HeroIdentityBlock from './HeroIdentityBlock'
import ProductDetailsTabs from './ProductDetailsTabs'
import SectionWrapper from './SectionWrapper'
import SectionSize from './SectionSize'
import SectionOrientation from './SectionOrientation'
import SectionBinding from './SectionBinding'
import SectionPages from './SectionPages'
import SectionPaper from './SectionPaper'
import SectionCover from './SectionCover'
import SectionBox from './SectionBox'
import SectionBag from './SectionBag'
import SectionImageLink from './SectionImageLink'
import SectionOrderType from './SectionOrderType'
import SectionProductionNotes from './SectionProductionNotes'
import OrderReviewBlock from './OrderReviewBlock'
import CTABlock from './CTABlock'
import PostConfigSections from './PostConfigSections'
import '../../styles/pdp-layout.css'

const sectionComponents = {
  size: SectionSize,
  orientation: SectionOrientation,
  binding: SectionBinding,
  pages: SectionPages,
  paper: SectionPaper,
  cover: SectionCover,
  box: SectionBox,
  bag: SectionBag,
  imageLink: SectionImageLink,
  orderType: SectionOrderType,
  notes: SectionProductionNotes,
}

const blockLabels = {
  A: 'Product Definition',
  B: 'Volume & Scope',
  C: 'Technical Configuration',
  D: 'Production Inputs',
  E: 'Additional',
}

export default function PDPLayout() {
  const {
    visibleSections, sectionStates, expandedSection,
    setExpandedSection, getNextSection, config,
  } = usePDPConfig()

  const sectionRefs = useRef({})
  const autoAdvanceTimer = useRef(null)
  const prevConfigRef = useRef(config)

  // Auto-advance: when a section becomes complete, wait 600ms then advance
  useEffect(() => {
    const prev = prevConfigRef.current
    prevConfigRef.current = config

    // Find if the currently expanded section just became complete
    if (!expandedSection) return
    const state = sectionStates[expandedSection]
    if (state !== 'complete') return

    // Check if it just became complete (wasn't complete before)
    clearTimeout(autoAdvanceTimer.current)
    autoAdvanceTimer.current = setTimeout(() => {
      const next = getNextSection(expandedSection)
      if (next) {
        setExpandedSection(next)
        // Smooth scroll to next section
        const el = sectionRefs.current[next]
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }, 600)

    return () => clearTimeout(autoAdvanceTimer.current)
  }, [sectionStates, expandedSection, getNextSection, setExpandedSection, config])

  const handleToggleSection = useCallback((sectionId) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId)
  }, [setExpandedSection])

  const handleDotClick = useCallback((sectionId) => {
    setExpandedSection(sectionId)
    const el = sectionRefs.current[sectionId]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [setExpandedSection])

  // Group sections by block
  let lastBlock = null

  return (
    <div className="pdp-page">
      <PDPHeader />

      <div className="pdp-layout">
        {/* Left: Product Visualizer */}
        <div className="pdp-left">
          <ProductVisualizer onSectionClick={handleDotClick} />
        </div>

        {/* Right: Configuration Panel */}
        <div className="pdp-right">
          <HeroIdentityBlock />
          <ProductDetailsTabs />

          <div className="pdp-sections-area">
            {visibleSections.map((section) => {
              const SectionContent = sectionComponents[section.id]
              if (!SectionContent) return null

              // Block label separator
              let blockLabel = null
              if (section.block !== lastBlock) {
                lastBlock = section.block
                blockLabel = (
                  <div className="pdp-block-label" key={`block-${section.block}`}>
                    {blockLabels[section.block] || section.block}
                  </div>
                )
              }

              return (
                <div key={section.id}>
                  {blockLabel}
                  <div ref={el => sectionRefs.current[section.id] = el}>
                    <SectionWrapper
                      sectionId={section.id}
                      title={section.title}
                      subtitle={section.subtitle}
                      required={section.required}
                      isExpanded={expandedSection === section.id}
                      onToggle={() => handleToggleSection(section.id)}
                      status={sectionStates[section.id] || 'not-visited'}
                    >
                      <SectionContent />
                    </SectionWrapper>
                  </div>
                </div>
              )
            })}
          </div>

          <OrderReviewBlock />
          <CTABlock />
        </div>
      </div>

      {/* Post-config full-width sections */}
      <div className="pdp-post-config">
        <div className="pdp-post-config-inner">
          <PostConfigSections />
        </div>
      </div>

      {/* Progress dots */}
      <SectionProgressDots
        sections={visibleSections}
        sectionStates={sectionStates}
        expandedSection={expandedSection}
        onDotClick={handleDotClick}
      />
    </div>
  )
}
