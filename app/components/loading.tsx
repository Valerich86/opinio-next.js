import { FaSpinner } from "react-icons/fa"; 

export default function Loading() {
  return (
    <div className="space-y-10">
      <FaSpinner className="animate-spin" size={30} color="gray"/>
      <span className="ml-4 text-gray-600">Загрузка...</span>
    </div>
  )
}
