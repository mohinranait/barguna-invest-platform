import { IUser } from "@/types/user.type";

import MemberLists from "@/components/pages/admin/members/MemberLists";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";

export default async function MembersPage() {
  await connectDB();
  const getMembers = await User.find({})
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();
  const members: IUser[] = JSON.parse(JSON.stringify(getMembers));

  return (
    <div className="p-6 md:p-8 space-y-6">
      <MemberLists members={members} />
    </div>
  );
}
