import { useMemo, useState } from 'react'
import products from '../../data/products'

const chevronSvg = (
  <svg viewBox="0 0 10 10" fill="none" width="10" height="10">
    <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`filter-section${open ? ' open' : ''}`}>
      <button className="filter-section-header" onClick={() => setOpen(o => !o)}>
        <h3>{title}</h3>
        <span className={`filter-chevron${open ? ' rotated' : ''}`}>{chevronSvg}</span>
      </button>
      {open && <div className="filter-section-body">{children}</div>}
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

  const materialGroups = useMemo(() => {
    const map = {}
    products.forEach(p => {
      if (p.material) {
        if (!map[p.material]) map[p.material] = 0
        map[p.material]++
      }
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
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

  const printTypeGroups = useMemo(() => {
    const map = {}
    products.forEach(p => {
      if (p.printTypes) p.printTypes.forEach(pt => {
        if (!map[pt]) map[pt] = 0
        map[pt]++
      })
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const activeCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <aside className="filter-sidebar">
      {activeCount > 0 && (
        <button className="filter-clear-all" onClick={() => onToggle('clear-all')}>
          Clear all filters
          <span className="filter-clear-count">{activeCount}</span>
        </button>
      )}

      <FilterSection title="Category">
        {categoryGroups.map(([cat, count]) => (
          <div className="filter-option" key={cat}>
            <input
              type="checkbox"
              id={`cat-${cat}`}
              checked={filters.categories.includes(cat)}
              onChange={() => onToggle('categories', cat)}
            />
            <label htmlFor={`cat-${cat}`}>{cat}</label>
            <span className="count">{count}</span>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Material" defaultOpen={false}>
        {materialGroups.map(([mat, count]) => (
          <div className="filter-option" key={mat}>
            <input
              type="checkbox"
              id={`mat-${mat}`}
              checked={filters.materials.includes(mat)}
              onChange={() => onToggle('materials', mat)}
            />
            <label htmlFor={`mat-${mat}`}>{mat}</label>
            <span className="count">{count}</span>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Size" defaultOpen={false}>
        {sizeGroups.map(([size, count]) => (
          <div className="filter-option" key={size}>
            <input
              type="checkbox"
              id={`size-${size}`}
              checked={filters.sizes.includes(size)}
              onChange={() => onToggle('sizes', size)}
            />
            <label htmlFor={`size-${size}`}>{size}</label>
            <span className="count">{count}</span>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Orientation" defaultOpen={false}>
        {orientationGroups.map(([ori, count]) => (
          <div className="filter-option" key={ori}>
            <input
              type="checkbox"
              id={`ori-${ori}`}
              checked={filters.orientations.includes(ori)}
              onChange={() => onToggle('orientations', ori)}
            />
            <label htmlFor={`ori-${ori}`}>{ori}</label>
            <span className="count">{count}</span>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Binding" defaultOpen={false}>
        {bindingGroups.map(([bind, count]) => (
          <div className="filter-option" key={bind}>
            <input
              type="checkbox"
              id={`bind-${bind}`}
              checked={filters.bindings.includes(bind)}
              onChange={() => onToggle('bindings', bind)}
            />
            <label htmlFor={`bind-${bind}`}>{bind}</label>
            <span className="count">{count}</span>
          </div>
        ))}
      </FilterSection>

      <FilterSection title="Print Type" defaultOpen={false}>
        {printTypeGroups.map(([pt, count]) => (
          <div className="filter-option" key={pt}>
            <input
              type="checkbox"
              id={`pt-${pt}`}
              checked={filters.printTypes.includes(pt)}
              onChange={() => onToggle('printTypes', pt)}
            />
            <label htmlFor={`pt-${pt}`}>{pt}</label>
            <span className="count">{count}</span>
          </div>
        ))}
      </FilterSection>
    </aside>
  )
}
