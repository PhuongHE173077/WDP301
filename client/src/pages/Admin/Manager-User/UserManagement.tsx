import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTable from "./UserTable";
import TenantTable from "./TenantTable";

const UserManagement = () => {
  return (
    <div className="w-full p-4 space-y-4">
      
      <h2 className="text-center text-3xl font-semibold text-gray-800">
        Danh sách người dùng
      </h2>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mx-auto">
          <TabsTrigger value="users">Tất cả người dùng</TabsTrigger>
          <TabsTrigger value="tenants">Khách thuê</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserTable />
        </TabsContent>
        <TabsContent value="tenants">
          <TenantTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
