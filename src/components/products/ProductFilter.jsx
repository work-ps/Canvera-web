import { useMemo, useState, useRef } from 'react'
import products from '../../data/products'
import collections from '../../data/collections'

const chevronUp = (
  <svg viewBox="0 0 10 10" fill="none" width="10" height="10">
    <path d="M7.5 6.25L5 3.75L2.5 6.25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const chevronDown = (
  <svg viewBox="0 0 10 10" fill="none" width="10" height="10">
    <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyRef = useRef(null)

  return (
    <div className="filter-section">
      <button className="filter-section-header" onClick={() => setOpen(o => !o)}>
        <span className="filter-section-label">{title}</span>
        <span className="filter-chevron">{open ? chevronUp : chevronDown}</span>
      </button>
      <div
        className="filter-section-body"
        ref={bodyRef}
        style={{
          maxHeight: open ? (bodyRef.current?.scrollHeight || 500) + 'px' : '0px',
          opacity: open ? 1 : 0,
        }}
      >
        <div className="filter-section-content">{children}</div>
      </div>
    </div>
  )
}

export default function ProductFilter({ filters, onToggle }) {
  const categoryGroups = useMemo(() => {
    const map = {}
    products.forEach(p => {
      if (!map[p.category]) map[p.category] = 0
      map[p.category]++
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const collectionOptions = useMemo(() => {
    return collections.map(col => col.name)
  }, [])

  const sizeGroups = useMemo(() => {
    const map = {}
    products.forEach(p => {
      if (p.sizes) p.sizes.forEach(s => {
        if (!map[s]) map[s] = 0
        map[s]++
      })
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const orientationGroups = useMemo(() => {
    const map = {}
    products.forEach(p => {
      if (p.orientations) p.orientations.forEach(o => {
        if (!map[o]) map[o] = 0
        map[o]++
      })
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const bindingGroups = useMemo(() => {
    const map = {}
    products.forEach(p => {
      if (p.bindings) p.bindings.forEach(b => {
        if (!map[b]) map[b] = 0
        map[b]++
      })
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  return (
    <aside className="filter-sidebar">
      <FilterSection title="Category">
        {categoryGroups.map(([cat]) => (
          <label className="filter-checkbox-option" key={cat}>
            <input
              type="checkbox"
              checked={filters.categories.includes(cat)}
              onChange={() => onToggle('categories', cat)}
            />
            <span className="filter-checkbox-label">{cat}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Collection" defaultOpen={false}>
        {collectionOptions.map(name => (
          <label className="filter-checkbox-option" key={name}>
            <input
              type="checkbox"
              checked={filters.collections.includes(name)}
              onChange={() => onToggle('collections', name)}
            />
            <span className="filter-checkbox-label">{name}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Size" defaultOpen={false}>
        <div className="filter-pills">
          {sizeGroups.map(([size]) => (
            <button
              key={size}
              className={`filter-pill${filters.sizes.includes(size) ? ' active' : ''}`}
              onClick={() => onToggle('sizes', size)}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Orientation" defaultOpen={false}>
        <div className="filter-pills">
          {orientationGroups.map(([ori]) => (
            <button
              key={ori}
              className={`filter-pill${filters.orientations.includes(ori) ? ' active' : ''}`}
              onClick={() => onToggle('orientations', ori)}
            >
              {ori}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Binding Type" defaultOpen={false}>
        <div className="filter-pills">
          {bindingGroups.map(([bind]) => (
            <button
              key={bind}
              className={`filter-pill${filters.bindings.includes(bind) ? ' active' : ''}`}
              onClick={() => onToggle('bindings', bind)}
            >
              {bind}
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  )
}
