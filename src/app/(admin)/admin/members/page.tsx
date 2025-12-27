"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Eye,
  UserCheck,
  AlertCircle,
  Download,
  X,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import { IUser } from "@/types/user.type";
import { format } from "date-fns";
import KycModal from "@/components/shared/KycModal";
import { IKyc } from "@/types/kyc.type";
import { FormDataType } from "./kyc-verification/page";
import Link from "next/link";

export default function MembersPage() {
  const [selectedKyc, setSelectedKyc] = useState<IKyc | null>(null);
  const [members, setMembers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [kycLoadingFetch, setKycLoadingFetch] = useState(false);
  const [selectedMember, setSelectedMember] = useState<
    (typeof members)[0] | null
  >(null);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState<FormDataType>({
    nid: {
      verify: true,
      note: "",
    },
    passport: {
      verify: true,
      note: "",
    },
    drivingLicence: {
      verify: true,
      note: "",
    },
  });

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "active") return matchesSearch && member.status === "active";
    if (filter === "pending")
      return matchesSearch && member.status === "pending";
    if (filter === "kyc-pending")
      return matchesSearch && member.kycStatus === "pending";
    return matchesSearch;
  });

  const getStatusColor = (
    status: "active" | "pending" | "suspended" | "rejected"
  ) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getKYCColor = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("/api/admin/members", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        console.log({ data });

        if (res.ok) {
          setMembers(data?.members);
        } else {
          console.error("Failed to fetch members:", data.error);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, []);

  // fetch kyc for a member
  const fetchKyc = async (memberId: string) => {
    setKycLoadingFetch(true);
    try {
      const res = await fetch(`/api/admin/members/kyc/${memberId}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        const user = members.find((m) => m._id === memberId);
        const d = {
          ...data?.kyc,
          userId: {
            fullName: user?.fullName,
            _id: memberId,
          },
        };
        setSelectedKyc(d || null);
      }
    } catch (error) {
      console.error(error);
    }
    setKycLoadingFetch(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Members Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage community members
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <Download size={20} /> Export List
        </Button>
      </div>

      {/* Search & Filter */}
      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Search Members
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-muted-foreground"
                size={20}
              />
              <Input
                placeholder="Search by name or email..."
                className="pl-10 h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              className="w-full px-3 py-2 border border-border rounded-lg text-sm h-11"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Members</option>
              <option value="active">Active Only</option>
              <option value="pending">Pending Approval</option>
              <option value="kyc-pending">KYC Pending</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full h-11 gap-2 bg-transparent"
            >
              <Filter size={20} /> More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Members Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between ">
          <h2 className="text-lg font-semibold">
            Members List ({filteredMembers.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Total: {members.length} members
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium text-muted-foreground">
                  Member
                </th>
                <th className="text-left py-3 font-medium text-muted-foreground">
                  Email
                </th>
                <th className="text-left py-3 font-medium text-muted-foreground">
                  Phone
                </th>
                <th className="text-right py-3 font-medium text-muted-foreground">
                  Invested
                </th>
                <th className="text-center py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left py-3 font-medium text-muted-foreground">
                  KYC
                </th>
                <th className="text-left py-3 font-medium text-muted-foreground w-[110px] ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member._id}
                  className="border-b hover:bg-muted/50 transition"
                >
                  <td className="py-3 font-medium">{member?.fullName}</td>
                  <td className="py-3 text-muted-foreground">
                    {member?.email}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {member?.phone}
                  </td>
                  <td className="py-3 text-right font-semibold">
                    ৳ {member?.investedAmount.toLocaleString()}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        member.status
                      )}`}
                    >
                      {member.status.charAt(0).toUpperCase() +
                        member.status.slice(1)}
                    </span>
                  </td>
                  <td
                    className={`py-3 font-medium ${getKYCColor(
                      member.kycStatus
                    )}`}
                  >
                    {member.kycStatus === "approved" ? (
                      <div className="flex items-center gap-1">
                        <UserCheck size={14} />
                        {member.kycStatus.charAt(0).toUpperCase() +
                          member.kycStatus.slice(1)}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <AlertCircle size={14} />
                        {member.kycStatus.charAt(0).toUpperCase() +
                          member.kycStatus.slice(1)}
                      </div>
                    )}
                  </td>
                  <td className="py-3 gap-2 flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMember(member)}
                      className="gap-1"
                      type="button"
                    >
                      <Eye size={16} /> View
                    </Button>
                    <Link href={`/admin/members/kyc/${member?._id}`}>
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        className="gap-1"
                      >
                        <Trash2 size={16} /> Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-0 max-h-[90vh] gap-0 overflow-y-auto">
            <div className="p-4 py-3 sticky top-0 bg-card border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">{selectedMember.fullName}</h2>
              <Button variant="ghost" onClick={() => setSelectedMember(null)}>
                <X />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 ">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground mb-1">
                      Full Name
                    </p>
                    <p className="font-medium">{selectedMember.fullName}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{selectedMember.email}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <p className="font-medium">{selectedMember.phone}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground mb-1">
                      Join Date
                    </p>
                    <p className="font-medium">
                      {format(
                        new Date(selectedMember.createdAt),
                        "MMM dd, yyyy - hh:mm a"
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground mb-1">Role</p>
                    <p className="font-medium">
                      {selectedMember.role.charAt(0).toUpperCase() +
                        selectedMember.role.slice(1)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="font-medium">
                      {selectedMember.status.charAt(0).toUpperCase() +
                        selectedMember.status.slice(1)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground mb-1">
                      Date Of Birth
                    </p>
                    <p className="font-medium">
                      {selectedMember?.dateOfBirth &&
                      !isNaN(new Date(selectedMember?.dateOfBirth).getTime())
                        ? format(
                            new Date(selectedMember?.dateOfBirth),
                            "MMM dd, yyyy"
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground mb-1">
                      KYC Status
                    </p>
                    <p className="font-medium">
                      {selectedMember?.kycStatus?.charAt(0).toUpperCase() +
                        selectedMember?.kycStatus?.slice(1) || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground mb-1">
                      Address
                    </p>
                    <p className="font-medium">
                      {selectedMember?.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Investment Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Investment Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-100/30 rounded">
                    <p className="text-xs text-muted-foreground mb-1">
                      Balance
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedMember?.balance.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded">
                    <p className="text-xs text-muted-foreground mb-1">
                      Total Invested
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ৳ {selectedMember?.investedAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => fetchKyc(selectedMember._id)}
                  variant="outline"
                  className="h-11 bg-transparent"
                  disabled={kycLoadingFetch}
                >
                  {kycLoadingFetch && <LoaderCircle className="animate-spin" />}
                  View KYC Documents
                </Button>
                <Button variant="outline" className="h-11 bg-transparent">
                  View Transaction History
                </Button>
              </div>

              {/* Status Management */}
              <div className="p-4 bg-secondary/10 rounded border-2 border-secondary/20">
                <h3 className="font-semibold mb-3">Update Member Status</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Account Status
                    </label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg text-sm h-11">
                      <option selected>Active</option>
                      <option>Inactive</option>
                      <option>Suspended</option>
                    </select>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedKyc && (
        <KycModal
          selectedKyc={selectedKyc}
          setSelectedKyc={setSelectedKyc}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </div>
  );
}
