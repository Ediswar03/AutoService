'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const stockMovementData = [
  { name: '13 Apr', inbound: 45, outbound: 32 },
  { name: '14 Apr', inbound: 28, outbound: 41 },
  { name: '15 Apr', inbound: 52, outbound: 28 },
  { name: '16 Apr', inbound: 38, outbound: 35 },
  { name: '17 Apr', inbound: 42, outbound: 29 },
  { name: '18 Apr', inbound: 65, outbound: 38 },
  { name: '19 Apr', inbound: 35, outbound: 12 },
]

const categoryData = [
  { name: 'Brake System', value: 156, fill: 'var(--color-chart-1)' },
  { name: 'Fluids', value: 89, fill: 'var(--color-chart-2)' },
  { name: 'Filters', value: 124, fill: 'var(--color-chart-3)' },
  { name: 'Electrical', value: 78, fill: 'var(--color-chart-4)' },
  { name: 'Suspension', value: 95, fill: 'var(--color-chart-5)' },
]

const mostRequestedParts = [
  { name: 'Engine Oil 5W-30', requests: 156 },
  { name: 'Brake Pad Set', requests: 134 },
  { name: 'Air Filter', requests: 98 },
  { name: 'Spark Plug', requests: 87 },
  { name: 'Coolant', requests: 76 },
]

export function DashboardCharts() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Stock Movement Chart */}
      <Card className="col-span-1 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 pb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">PERGERAKAN STOK</p>
          <CardTitle className="text-xl font-black uppercase italic tracking-tighter">7-Day Analytics</CardTitle>
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory flow comparison</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockMovementData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{
                    backgroundColor: '#0A0A0B',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                    padding: '12px'
                  }}
                  itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  labelStyle={{ fontSize: '10px', fontWeight: 900, color: '#64748b', marginBottom: '4px', textTransform: 'uppercase' }}
                />
                <Bar dataKey="inbound" name="In" fill="#10b981" radius={[6, 6, 0, 0]} barSize={12} />
                <Bar dataKey="outbound" name="Out" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inbound Flow</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Outbound Flow</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Most Requested Parts */}
      <Card className="col-span-1 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 pb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">DATA PERMINTAAN</p>
          <CardTitle className="text-xl font-black uppercase italic tracking-tighter">Hot Spareparts</CardTitle>
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">High-demand items this month</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostRequestedParts} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  type="number"
                  hide
                />
                <YAxis 
                  dataKey="name" 
                  type="category"
                  tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{
                    backgroundColor: '#0A0A0B',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '12px'
                  }}
                  itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                  labelStyle={{ display: 'none' }}
                />
                <Bar dataKey="requests" name="Qty" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="col-span-1 lg:col-span-2 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 pb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">DISTRIBUSI KATEGORI</p>
          <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">Inventory Structure</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A0A0B',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '12px'
                    }}
                    itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div 
                      className="size-3 rounded-full" 
                      style={{ backgroundColor: category.fill, boxShadow: `0 0 10px ${category.fill}66` }}
                    />
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{category.name}</span>
                  </div>
                  <span className="text-sm font-black italic tracking-tighter text-slate-900 dark:text-white">{category.value} <span className="text-[9px] font-bold text-slate-400 not-italic uppercase ml-1">Items</span></span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
