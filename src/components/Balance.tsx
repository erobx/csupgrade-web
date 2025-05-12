
export default function Balance({ balance }: { balance: number }) {
  return (
    <button className="btn badge-md md:badge-lg btn-success mr-1.5">
      ${balance.toFixed(2)}
    </button>
  )
}
