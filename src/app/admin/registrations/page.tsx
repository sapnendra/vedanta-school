"use client";

import { Check, CheckCircle2, ClipboardList, Clock, Copy, Download, ExternalLink, Loader2, RefreshCw, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SeminarOption = {
  _id: string;
  title: string;
};

type PaymentStatus = "pending" | "captured" | "failed";

type RegistrationRow = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  seminarTitle: string;
  seminarId: string;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  addedToGroup?: boolean;
  createdAt: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const statusClassMap: Record<PaymentStatus, string> = {
  captured: "bg-green-500/20 text-green-300 border-green-400/20",
  pending: "bg-amber-500/20 text-amber-300 border-amber-400/20",
  failed: "bg-red-500/20 text-red-300 border-red-400/20",
};

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [seminars, setSeminars] = useState<SeminarOption[]>([]);
  const [seminarFilter, setSeminarFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusDrafts, setStatusDrafts] = useState<Record<string, PaymentStatus>>({});
  const [groupDrafts, setGroupDrafts] = useState<Record<string, boolean>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [manualVerifyId, setManualVerifyId] = useState<string | null>(null);
  const [copiedPaymentId, setCopiedPaymentId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSeminars = async () => {
      const response = await fetch("/api/seminars");
      if (!response.ok) return;
      const data = (await response.json()) as Array<{ _id: string; title: string }>;
      if (mounted) {
        setSeminars(data.map((seminar) => ({ _id: seminar._id, title: seminar.title })));
      }
    };

    loadSeminars();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadRegistrations = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (seminarFilter !== "all") params.set("seminarId", seminarFilter);
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (groupFilter !== "all") params.set("groupStatus", groupFilter);
        if (searchTerm) params.set("search", searchTerm);

        const query = params.toString();
        const response = await fetch(`/api/admin/registrations${query ? `?${query}` : ""}`);
        if (!response.ok) return;

        const data = (await response.json()) as RegistrationRow[];
        if (mounted) {
          setRegistrations(data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadRegistrations();

    return () => {
      mounted = false;
    };
  }, [seminarFilter, statusFilter, groupFilter, searchTerm]);

  const countText = useMemo(() => `Showing ${registrations.length} registrations`, [registrations.length]);
  const capturedCount = useMemo(
    () => registrations.filter((item) => item.paymentStatus === "captured").length,
    [registrations]
  );
  const pendingCount = useMemo(
    () => registrations.filter((item) => item.paymentStatus === "pending").length,
    [registrations]
  );
  const failedCount = useMemo(
    () => registrations.filter((item) => item.paymentStatus === "failed").length,
    [registrations]
  );

  const updatePaymentStatus = async (registrationId: string) => {
    const current = registrations.find((item) => item._id === registrationId);
    if (!current) return;

    const nextStatus = statusDrafts[registrationId] ?? current.paymentStatus;
    if (nextStatus === current.paymentStatus) {
      toast.info("Status is already up to date");
      return;
    }

    setUpdatingId(registrationId);

    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus: nextStatus }),
      });

      const body = (await response.json()) as { error?: string; paymentStatus?: PaymentStatus };

      if (!response.ok) {
        toast.error(body.error ?? "Failed to update payment status");
        return;
      }

      setRegistrations((prev) =>
        prev.map((item) =>
          item._id === registrationId ? { ...item, paymentStatus: nextStatus } : item
        )
      );

      toast.success("Payment status updated");
    } catch {
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingId(null);
    }
  };

  const updateGroupStatus = async (registrationId: string) => {
    const current = registrations.find((item) => item._id === registrationId);
    if (!current) return;

    const nextStatus = groupDrafts[registrationId] ?? Boolean(current.addedToGroup);
    if (nextStatus === Boolean(current.addedToGroup)) {
      toast.info("Group status is already up to date");
      return;
    }

    setUpdatingId(registrationId);

    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addedToGroup: nextStatus }),
      });

      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Failed to update group status");
        return;
      }

      setRegistrations((prev) =>
        prev.map((item) =>
          item._id === registrationId ? { ...item, addedToGroup: nextStatus } : item
        )
      );

      toast.success("Group status updated");
    } catch {
      toast.error("Failed to update group status");
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Occupation", "Seminar", "Status", "Added To Group", "Date"];
    const rows = registrations.map((r) => [
      r.name,
      r.email,
      r.phone,
      r.occupation,
      r.seminarTitle,
      r.paymentStatus,
      r.addedToGroup ? "yes" : "no",
      r.createdAt,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "registrations.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const createRetryPaymentLink = async (registrationId: string) => {
    const current = registrations.find((item) => item._id === registrationId);
    if (!current) return;

    if (current.paymentStatus === "captured") {
      toast.info("Payment already captured");
      return;
    }

    setRetryingId(registrationId);
    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}/retry-payment`, {
        method: "POST",
      });

      const body = (await response.json()) as { error?: string; shortUrl?: string };

      if (!response.ok || !body.shortUrl) {
        toast.error(body.error ?? "Failed to create retry link");
        return;
      }

      await navigator.clipboard.writeText(body.shortUrl);
      window.open(body.shortUrl, "_blank", "noopener,noreferrer");
      toast.success("Retry link created, opened, and copied to clipboard");
    } catch {
      toast.error("Failed to create retry link");
    } finally {
      setRetryingId(null);
    }
  };

  const clearFilters = () => {
    setSeminarFilter("all");
    setStatusFilter("all");
    setGroupFilter("all");
    setSearchInput("");
    setSearchTerm("");
  };

  const copyPaymentIdToClipboard = async (paymentId: string) => {
    try {
      await navigator.clipboard.writeText(paymentId);
      setCopiedPaymentId(paymentId);
      toast.success("Payment ID copied");
      setTimeout(() => setCopiedPaymentId((current) => (current === paymentId ? null : current)), 1600);
    } catch {
      toast.error("Failed to copy payment ID");
    }
  };

  const retryVerifyPayment = async (registrationId: string) => {
    setManualVerifyId(registrationId);
    try {
      const response = await fetch(`/api/admin/registrations/${registrationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus: "captured" }),
      });

      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(body.error ?? "Failed to mark as captured");
        return;
      }

      setRegistrations((prev) =>
        prev.map((item) =>
          item._id === registrationId ? { ...item, paymentStatus: "captured" } : item
        )
      );

      toast.success("Marked as captured");
    } catch {
      toast.error("Failed to mark as captured");
    } finally {
      setManualVerifyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl text-white font-heading">Registrations</h1>
        <Button asChild variant="ghost" className="text-ivory hover:text-saffron hover:bg-saffron/10">
          <a href="https://dashboard.razorpay.com/app/payments" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            View in Razorpay
          </a>
        </Button>
      </div>

      <Card className="border-saffron/10 bg-[#14110d]">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="w-full md:max-w-xs">
            <Select value={seminarFilter} onValueChange={setSeminarFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Seminars" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seminars</SelectItem>
                {seminars.map((seminar) => (
                  <SelectItem key={seminar._id} value={seminar._id}>{seminar.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:max-w-xs">
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  setSearchTerm(searchInput.trim());
                }
              }}
              placeholder="Search by name, email, phone..."
            />
          </div>

          <div className="w-full md:max-w-xs">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">pending</SelectItem>
                <SelectItem value="captured">captured</SelectItem>
                <SelectItem value="failed">failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:max-w-xs">
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Group Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Group Status</SelectItem>
                <SelectItem value="added">added</SelectItem>
                <SelectItem value="not-added">not-added</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setSearchTerm(searchInput.trim())}
            className="border-saffron/20 text-ivory hover:bg-saffron/10"
          >
            Search
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
            className="border-saffron/20 text-ivory hover:bg-saffron/10"
          >
            Clear Filters
          </Button>

          <Button onClick={exportCSV} className="md:ml-auto bg-saffron text-charcoal hover:bg-gold">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </CardContent>
      </Card>

      <p className="text-sm text-white/55 [font-family:var(--font-poppins)]">{countText}</p>

      <div className="flex flex-wrap gap-2">
        <Badge className="border border-green-400/30 bg-green-500/15 text-green-300 px-3 py-1">
          <CheckCircle2 className="h-4 w-4" />
          {capturedCount} Paid
        </Badge>
        <Badge className="border border-amber-400/30 bg-amber-500/15 text-amber-300 px-3 py-1">
          <Clock className="h-4 w-4" /> 
          {pendingCount} Pending
        </Badge>
        <Badge className="border border-red-400/30 bg-red-500/15 text-red-300 px-3 py-1">
          <XCircle className="h-4 w-4" /> 
          {failedCount} Failed
        </Badge>
      </div>

      <Card className="border-saffron/10 bg-[#14110d]">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="grid grid-cols-9 gap-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          ) : registrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-white/55">
              <ClipboardList className="h-8 w-8 text-saffron" />
              <p className="text-sm [font-family:var(--font-poppins)]">No registrations found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Occupation</TableHead>
                  <TableHead>Seminar</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Added To Group</TableHead>
                  <TableHead>Registered On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration._id}>
                    <TableCell>{registration.name}</TableCell>
                    <TableCell>{registration.email}</TableCell>
                    <TableCell>{registration.phone}</TableCell>
                    <TableCell>{registration.occupation}</TableCell>
                    <TableCell>{registration.seminarTitle}</TableCell>
                    <TableCell>
                      <div className="flex min-w-52 items-center gap-2">
                        <Select
                          value={statusDrafts[registration._id] ?? registration.paymentStatus}
                          onValueChange={(value) =>
                            setStatusDrafts((prev) => ({
                              ...prev,
                              [registration._id]: value as PaymentStatus,
                            }))
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">pending</SelectItem>
                            <SelectItem value="captured">captured</SelectItem>
                            <SelectItem value="failed">failed</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          type="button"
                          size="sm"
                          onClick={() => updatePaymentStatus(registration._id)}
                          disabled={updatingId === registration._id}
                          className="bg-saffron text-charcoal hover:bg-gold"
                        >
                          {updatingId === registration._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>

                        <Badge className={statusClassMap[registration.paymentStatus]}>
                          {registration.paymentStatus}
                        </Badge>

                        {registration.paymentStatus !== "captured" ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => createRetryPaymentLink(registration._id)}
                            disabled={retryingId === registration._id}
                            className="border-saffron/20 text-ivory hover:bg-saffron/10"
                          >
                            {retryingId === registration._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RotateCcw className="h-4 w-4" />
                            )}
                            Retry Payment
                          </Button>
                        ) : null}

                        {registration.paymentStatus === "failed" ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="border-red-400/25 text-red-300 hover:bg-red-500/10"
                                disabled={manualVerifyId === registration._id}
                              >
                                {manualVerifyId === registration._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="h-4 w-4" />
                                )}
                                Retry Verify
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Mark as Captured?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure? Only do this after confirming payment in Razorpay dashboard.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => retryVerifyPayment(registration._id)}>
                                  Confirm
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {registration.paymentId ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-sm text-ivory/85 hover:text-saffron"
                          onClick={() => copyPaymentIdToClipboard(registration.paymentId as string)}
                        >
                          <span>{registration.paymentId}</span>
                          {copiedPaymentId === registration.paymentId ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      ) : (
                        <span className="text-white/45">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex min-w-56 items-center gap-2">
                        <Select
                          value={(groupDrafts[registration._id] ?? Boolean(registration.addedToGroup)) ? "yes" : "no"}
                          onValueChange={(value) =>
                            setGroupDrafts((prev) => ({
                              ...prev,
                              [registration._id]: value === "yes",
                            }))
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">yes</SelectItem>
                            <SelectItem value="no">no</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          type="button"
                          size="sm"
                          onClick={() => updateGroupStatus(registration._id)}
                          disabled={updatingId === registration._id}
                          className="bg-saffron text-charcoal hover:bg-gold"
                        >
                          {updatingId === registration._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>

                        <Badge className={registration.addedToGroup ? "bg-green-500/20 text-green-300 border-green-400/20" : "bg-white/10 text-white/70 border-white/20"}>
                          {registration.addedToGroup ? "added" : "not added"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{dateFormatter.format(new Date(registration.createdAt))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
