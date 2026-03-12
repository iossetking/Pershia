export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <p>navbar</p>
    </div>
  )
}