"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Card, CardContent } from "@/components/ui/card"
import { UserForm } from "@/components/admin/UserForm"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api-client"

export default function EditTeamPage() {
  const params = useParams()
  const [initialData, setInitialData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = (await api.get(`/users/${params.id}`)) as any
        const data = res.data?.data || res.data
        setInitialData(data)
      } catch (error) {
        console.error("Failed to fetch user", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchUser()
    }
  }, [params.id])

  return (
    <>
      <AdminHeader 
        title="Edit Anggota Tim" 
        description="Perbarui informasi dan peran akses anggota tim." 
      />
      <div className="p-6 max-w-3xl mx-auto w-full">
        <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : initialData ? (
              <UserForm initialData={initialData} isEditing={true} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Pengguna tidak ditemukan.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
