"use client"
import React from 'react'
import { FileText, Download, Eye } from 'lucide-react'

function Reports() {
  const reportsData = [
    { id: 1, name: 'Monthly Sales Report', type: 'Sales', status: 'Completed', date: '2025-05-15' },
    { id: 2, name: 'User Analytics', type: 'Analytics', status: 'Processing', date: '2025-05-18' },
    { id: 3, name: 'Financial Summary', type: 'Finance', status: 'Completed', date: '2025-05-10' },
    { id: 4, name: 'Performance Metrics', type: 'Performance', status: 'Scheduled', date: '2025-05-25' }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Processing': return 'bg-yellow-100 text-yellow-800'
      case 'Scheduled': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Reports Dashboard</h2>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportsData.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText size={16} className="text-gray-400 mr-3" />
                    <span className="text-sm font-medium">{report.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{report.type}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{report.date}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {report.status === 'Completed' && (
                      <>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye size={16} />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <Download size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports