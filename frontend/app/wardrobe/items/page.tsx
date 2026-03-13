import ItemNav from "./ItemNav"
import CosItems from "./ConItem"
export default function Items() {
  return (
    <div className="p-2">
      <ItemNav />
      <div className="p-2">
        <CosItems />
      </div>
    </div>
  )
}