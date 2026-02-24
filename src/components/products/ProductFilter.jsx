import { useMemo } from 'react'
import products from '../../data/products'

export default function ProductFilter({ selectedCategories, onToggleCategory }) {
  const categoryGroups = useMemo(() => {
    const map = {}
    products.forEach(p => {
      if (!map[p.category]) map[p.category] = 0
      map[p.category]++
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [])

  const sizeOptions = ['8×10', '10×14', '12×18', '16×20']
  const typeOptions = ['Flushmount', 'Photobook', 'Canvas', 'Framed', 'Gift']

  return (
    <aside className="filter-sidebar">
      <div className="filter-section">
        <h3>Category</h3>
        {categoryGroups.map(([cat, count]) => (
          <div className="filter-option" key={cat}>
            <input
              type="checkbox"
              id={`cat-${cat}`}
              checked={selectedCategories.includes(cat)}
              onChange={() => onToggleCategory(cat)}
            />
            <label htmlFor={`cat-${cat}`}>{cat}</label>
            <span className="count">{count}</span>
          </div>
        ))}
      </div>

      <div className="filter-section">
        <h3>Album Type</h3>
        {typeOptions.map(type => (
          <div className="filter-option" key={type}>
            <input type="checkbox" id={`type-${type}`} />
            <label htmlFor={`type-${type}`}>{type}</label>
          </div>
        ))}
      </div>

      <div className="filter-section">
        <h3>Size</h3>
        {sizeOptions.map(size => (
          <div className="filter-option" key={size}>
            <input type="checkbox" id={`size-${size}`} />
            <label htmlFor={`size-${size}`}>{size}</label>
          </div>
        ))}
      </div>
    </aside>
  )
}
