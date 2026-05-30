import { AdminHeader } from "@/components/admin/AdminHeader"
import { Card, CardContent } from "@/components/ui/card"
import { UserForm } from "@/components/admin/UserForm"

export default function CreateTeamPage() {
  return (
    <>
      <AdminHeader 
        title="Tambah Anggota Tim" 
        description="Tambahkan pengguna baru dan atur peran aksesnya ke dalam sistem." 
      />
      <div className="p-6 max-w-3xl mx-auto w-full">
        <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <UserForm />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
