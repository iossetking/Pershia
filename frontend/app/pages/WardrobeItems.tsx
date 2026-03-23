type Props = {
  name: string;
  brand: string;
  size: string;
  color: string;
  image: string;
};

export default function WardrobeItem({ name, brand, size, color, image }: Props) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden", width: "200px" }}>
      <img src={image} alt={name} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
      <div style={{ padding: "10px" }}>
        <p style={{ fontWeight: "bold", margin: "0 0 4px" }}>{name}</p>
        <p style={{ color: "#888", fontSize: "13px", margin: "0 0 4px" }}>{brand}</p>
        <p style={{ fontSize: "12px", margin: 0 }}>Talla: {size} · {color}</p>
      </div>
    </div>
  );
}
