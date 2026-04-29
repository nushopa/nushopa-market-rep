import { MdRefresh, MdCheckCircle, MdSchedule, MdAssignment } from 'react-icons/md'

interface Order {
  id: number
  number: string
  customer: string
  items: number
  total: string
  status: 'processing' | 'completed' | 'pending'
}

const orders: Order[] = [
  { id: 1, number: 'ORD-1001', customer: 'John Doe', items: 3, total: '$299.99', status: 'processing' },
  { id: 2, number: 'ORD-1002', customer: 'Jane Smith', items: 2, total: '$149.99', status: 'completed' },
  { id: 3, number: 'ORD-1003', customer: 'Bob Johnson', items: 4, total: '$499.99', status: 'pending' },
]

const statusConfig = {
  processing: { label: 'Processing', color: 'yellow', icon: MdSchedule },
  completed: { label: 'Completed', color: 'green', icon: MdCheckCircle },
  pending: { label: 'Pending', color: 'orange', icon: MdSchedule },
}

export default function Order() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105">
            <MdRefresh className="h-5 w-5" />
          </button>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-xl shadow-sm">
            {orders.length} Active
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => {
                const statusInfo = statusConfig[order.status]
                const Icon = statusInfo.icon
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 flex items-center">
                        <MdAssignment className="h-4 w-4 mr-2 text-blue-600" />
                        {order.number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.items} items</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{order.total}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full shadow-sm`}>
                        <Icon className="h-3 w-3 mr-1 flex-shrink-0" />
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}