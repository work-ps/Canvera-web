import './BentoGallery.css';

/*
  Bento layout — 6 columns, 3 rows, every cell unique:
  Row 1: [Celestial 2c] [Luxury 1c] [Suede 1c ×2rows] [Foiling 2c]
  Row 2: [Leatherette 1c] [Signature 2c]  [Suede ↑]   [Fabric 2c]
  Row 3: [Wood ——————— 3c ———————]  [Custom Cover ——— 3c ———]
*/

const layoutMap = [
  { col: '1 / 3', row: '1 / 2' },        // 0 - Celestial (2 cols)
  { col: '3 / 4', row: '1 / 2' },        // 1 - Luxury (1 col)
  { col: '4 / 5', row: '1 / 3' },        // 2 - Suede (1 col, 2 rows tall)
  { col: '5 / 7', row: '1 / 2' },        // 3 - Foiling (2 cols)
  { col: '1 / 2', row: '2 / 3' },        // 4 - Leatherette (1 col)
  { col: '2 / 4', row: '2 / 3' },        // 5 - Signature (2 cols)
  { col: '5 / 7', row: '2 / 3' },        // 6 - Fabric (2 cols)
  { col: '1 / 4', row: '3 / 4' },        // 7 - Wood (3 cols)
  { col: '4 / 7', row: '3 / 4' },        // 8 - Custom Cover (3 cols)
];

export default function BentoGallery({ collections }) {
  return (
    <div className="bento">
      {collections.slice(0, 9).map((item, i) => (
        <BentoItem
          key={item.id}
          item={item}
          layout={layoutMap[i]}
          index={i}
        />
      ))}
    </div>
  );
}

function BentoItem({ item, layout, index }) {
  return (
    <a
      href={`/collections/${item.slug}`}
      className="bento__item bento__fade-in"
      style={{
        gridColumn: layout.col,
        gridRow: layout.row,
        animationDelay: `${index * 0.06}s`,
      }}
    >
      <div className="bento__image-wrap">
        <img
          src={item.image}
          alt={item.name}
          className="bento__image"
          draggable={false}
        />
        <div className="bento__overlay">
          <span className="bento__label">{item.name}</span>
        </div>
      </div>
    </a>
  );
}
