export default function CardGridContainer({
  children,
  className = '',
  maxCols = 3,
}: any) {
  return (
    <div
      id="card-grid-container"
      className={`h-full w-full mb-10 grid grid-cols-1 min-[1100px]:grid-cols-2 min-[1450px]:grid-cols-${maxCols} mt-5 gap-5 [&>*]:self-start ${className}`}
    >
      {children}
    </div>
  )
}
