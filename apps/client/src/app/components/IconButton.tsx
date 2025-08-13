
export default function IconButton({
  icon, onClick, activated
}: {
  icon: React.ReactNode,
  onClick: () => void,
  activated: boolean
}){

  return <div className={`p-2 rounded text-white cursor-pointer m-2 ${activated ? 'bg-neutral-500' : 'bg-transparent'}`}
    onClick={onClick}>
    {icon}
  </div>
}