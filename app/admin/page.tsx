'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Leaf,
  LayoutDashboard,
  ListChecks,
  BarChart3,
  LogOut,
  Search,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Trash2,
  X,
  Loader2,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Users,
  Image as ImageIcon,
  Settings,
  Tag,
  Mail,
  MessageSquare,
  Save,
  Plus,
  Pencil,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAuth } from '@/components/auth-provider';
import {
  supabase,
  type PickupRequest,
  type PickupStatus,
  type CustomerProfile,
  type Service,
  type PricingTier,
  type ContactMessage,
  type SiteSettings,
  STATUS_LABELS,
  STATUS_COLORS,
  WASTE_TYPES,
} from '@/lib/supabase';
import { toast } from 'sonner';
import { AdminCustomersTab } from '@/components/admin-customers-tab';

const statusOptions: PickupStatus[] = ['pending', 'confirmed', 'assigned', 'on_the_way', 'completed', 'cancelled'];

const ICON_OPTIONS = [
  'Home', 'Building2', 'Users', 'HardHat', 'Zap', 'Leaf', 'Building',
  'Landmark', 'Recycle', 'Truck', 'Trash2', 'AlertCircle',
];

export default function AdminDashboard() {
  const router = useRouter();
  const { session, loading, isAdmin, signOut } = useAuth();

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [isAdmin, loading, session, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <img
                  src="/IMG-20260806-WA0001.jpg"
                  alt="CleanBin"
                  className="h-10 w-auto object-contain"
                />
                <span className="text-xs text-muted-foreground">Admin</span>
              </div>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-3 sm:grid-cols-7 mb-8 gap-y-1">
            <TabsTrigger value="requests">
              <ListChecks className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Requests</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="customers">
              <Users className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Customers</span>
            </TabsTrigger>
            <TabsTrigger value="services">
              <Tag className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="pricing">
              <Tag className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <RequestsTab />
          </TabsContent>
          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>
          <TabsContent value="customers">
            <AdminCustomersTab />
          </TabsContent>
          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>
          <TabsContent value="pricing">
            <PricingTab />
          </TabsContent>
          <TabsContent value="messages">
            <MessagesTab />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ============ REQUESTS TAB ============ */

function RequestsTab() {
  const { session } = useAuth();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<PickupRequest | null>(null);
  const [updating, setUpdating] = useState(false);
  const [editStatus, setEditStatus] = useState<PickupStatus>('pending');
  const [editWorker, setEditWorker] = useState('');
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    if (session) fetchRequests();
  }, [session]);

  const fetchRequests = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('pickup_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Failed to load requests');
    } else {
      setRequests(data || []);
    }
    setFetching(false);
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      !searchQuery ||
      req.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.phone_number.includes(searchQuery) ||
      req.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.lga.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openEditDialog = (req: PickupRequest) => {
    setSelectedRequest(req);
    setEditStatus(req.status);
    setEditWorker(req.assigned_worker || '');
    setEditPrice(req.price?.toString() || '');
  };

  const handleUpdate = async () => {
    if (!selectedRequest) return;
    setUpdating(true);
    const { error } = await supabase
      .from('pickup_requests')
      .update({
        status: editStatus,
        assigned_worker: editWorker || null,
        price: editPrice ? parseFloat(editPrice) : null,
      })
      .eq('id', selectedRequest.id);
    if (error) {
      toast.error('Failed to update request');
    } else {
      toast.success('Request updated successfully');
      setSelectedRequest(null);
      fetchRequests();
    }
    setUpdating(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('pickup_requests').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete request');
    } else {
      toast.success('Request deleted');
      setSelectedRequest(null);
      fetchRequests();
    }
  };

  const wasteTypeLabel = (value: string) =>
    WASTE_TYPES.find((wt) => wt.value === value)?.label || value;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, Phone, Address, LGA..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {fetching ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-20">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No requests found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((req) => (
            <Card key={req.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openEditDialog(req)}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-heading font-semibold text-lg">{req.full_name}</h3>
                      <Badge className={`${STATUS_COLORS[req.status]} border`}>
                        {STATUS_LABELS[req.status]}
                      </Badge>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" />
                        {req.phone_number}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        {req.lga}
                      </div>
                      <div className="flex items-center gap-2">
                        <Trash2 className="h-3.5 w-3.5" />
                        {wasteTypeLabel(req.waste_type)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(req.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{req.address}</p>
                    {req.assigned_worker && (
                      <p className="text-xs text-primary">Assigned to: {req.assigned_worker}</p>
                    )}
                    {req.price && (
                      <p className="text-xs font-medium">Price: ₦{req.price.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Request Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Name</p>
                    <p className="font-medium">{selectedRequest.full_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Phone</p>
                    <p className="font-medium">{selectedRequest.phone_number}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs">Address</p>
                    <p className="font-medium">{selectedRequest.address}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">LGA</p>
                    <p className="font-medium">{selectedRequest.lga}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Waste Type</p>
                    <p className="font-medium">{wasteTypeLabel(selectedRequest.waste_type)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Quantity</p>
                    <p className="font-medium">{selectedRequest.waste_quantity}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Preferred Date</p>
                    <p className="font-medium">{selectedRequest.preferred_date || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Preferred Time</p>
                    <p className="font-medium">{selectedRequest.preferred_time || 'N/A'}</p>
                  </div>
                  {selectedRequest.notes && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground text-xs">Notes</p>
                      <p className="font-medium">{selectedRequest.notes}</p>
                    </div>
                  )}
                  {selectedRequest.photo_url && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground text-xs mb-1">Photo</p>
                      <a href={selectedRequest.photo_url} target="_blank" rel="noopener noreferrer">
                        <img src={selectedRequest.photo_url} alt="Waste" className="rounded-lg max-h-48 w-full object-cover" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div>
                    <Label htmlFor="edit-status">Update Status</Label>
                    <Select value={editStatus} onValueChange={(v) => setEditStatus(v as PickupStatus)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-worker">Assigned Worker</Label>
                    <Input
                      id="edit-worker"
                      placeholder="Worker name"
                      className="mt-1.5"
                      value={editWorker}
                      onChange={(e) => setEditWorker(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-price">Price (₦)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      placeholder="0"
                      className="mt-1.5"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleUpdate} disabled={updating} className="flex-1">
                    {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(selectedRequest.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============ DASHBOARD TAB ============ */

function DashboardTab() {
  const { session } = useAuth();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (session) fetchRequests();
  }, [session]);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('pickup_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setRequests(data || []);
    setFetching(false);
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const total = requests.length;
  const completed = requests.filter((r) => r.status === 'completed').length;
  const pending = requests.filter((r) => r.status === 'pending').length;
  const inProgress = requests.filter(
    (r) => r.status === 'confirmed' || r.status === 'assigned' || r.status === 'on_the_way'
  ).length;
  const revenue = requests
    .filter((r) => r.status === 'completed' && r.price)
    .reduce((sum, r) => sum + (r.price || 0), 0);

  const byType = WASTE_TYPES.map((wt) => ({
    label: wt.label,
    count: requests.filter((r) => r.waste_type === wt.value).length,
  }));

  const byLga = requests.reduce((acc, r) => {
    acc[r.lga] = (acc[r.lga] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topLgas = Object.entries(byLga).sort(([, a], [, b]) => b - a).slice(0, 5);

  const byStatus = statusOptions.map((s) => ({
    status: s,
    label: STATUS_LABELS[s],
    count: requests.filter((r) => r.status === s).length,
  }));

  const monthly = requests.reduce((acc, r) => {
    const month = new Date(r.created_at).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const wasteTypeLabel = (value: string) =>
    WASTE_TYPES.find((wt) => wt.value === value)?.label || value;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: total, icon: ListChecks, color: 'text-primary' },
          { label: 'Pending', value: pending, icon: AlertCircle, color: 'text-amber-500' },
          { label: 'In Progress', value: inProgress, icon: Clock, color: 'text-blue-500' },
          { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold font-heading mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-10 w-10 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-heading font-semibold text-lg mb-4">Requests by Status</h3>
            <div className="space-y-3">
              {byStatus.map((s) => (
                <div key={s.status} className="flex items-center justify-between">
                  <Badge className={`${STATUS_COLORS[s.status]} border`}>{s.label}</Badge>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${total ? (s.count / total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{s.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-heading font-semibold text-lg mb-4">Requests by Waste Type</h3>
            <div className="space-y-3">
              {byType.map((wt, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{wt.label}</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${total ? (wt.count / total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{wt.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-heading font-semibold text-lg mb-4">Top Local Government Areas</h3>
          <div className="space-y-3">
            {topLgas.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              topLgas.map(([lga, count], i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium">{lga}</span>
                  </div>
                  <span className="text-sm font-semibold">{count} requests</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-heading font-semibold text-lg mb-4">Monthly Statistics</h3>
          {Object.keys(monthly).length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(monthly).map(([month, count], i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{month}</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(count / Math.max(...Object.values(monthly))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-semibold text-lg">Revenue & Insights</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-sm text-muted-foreground">Total Revenue (Completed)</p>
              <p className="text-2xl font-bold font-heading mt-1">₦{revenue.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold font-heading mt-1">
                {total ? Math.round((completed / total) * 100) : 0}%
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <p className="text-sm text-muted-foreground">Unique Customers</p>
              <p className="text-2xl font-bold font-heading mt-1">
                {new Set(requests.map((r) => r.phone_number)).size}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-heading font-semibold text-lg mb-4">Recent Completed Jobs</h3>
          {requests.filter((r) => r.status === 'completed').length === 0 ? (
            <p className="text-sm text-muted-foreground">No completed jobs yet.</p>
          ) : (
            <div className="space-y-2">
              {requests.filter((r) => r.status === 'completed').slice(0, 10).map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="text-sm font-medium">{req.full_name}</p>
                    <p className="text-xs text-muted-foreground">{req.lga} · {wasteTypeLabel(req.waste_type)}</p>
                  </div>
                  <div className="text-right">
                    {req.price && <p className="text-sm font-semibold">₦{req.price.toLocaleString()}</p>}
                    <p className="text-xs text-muted-foreground">{new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ============ SERVICES TAB ============ */

function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    icon: 'Home',
    features: '',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      toast.error('Failed to load services');
    } else {
      setServices(data || []);
    }
    setFetching(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', icon: 'Home', features: '', sort_order: services.length, is_active: true });
    setShowForm(true);
  };

  const openEdit = (svc: Service) => {
    setEditing(svc);
    setForm({
      title: svc.title,
      description: svc.description,
      icon: svc.icon,
      features: svc.features.join('\n'),
      sort_order: svc.sort_order,
      is_active: svc.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const features = form.features.split('\n').map((f) => f.trim()).filter(Boolean);
    const payload = {
      title: form.title,
      description: form.description,
      icon: form.icon,
      features,
      sort_order: form.sort_order,
      is_active: form.is_active,
    };

    if (editing) {
      const { error } = await supabase.from('services').update(payload).eq('id', editing.id);
      if (error) {
        toast.error('Failed to update service');
      } else {
        toast.success('Service updated');
        setShowForm(false);
        fetchServices();
      }
    } else {
      const { error } = await supabase.from('services').insert(payload);
      if (error) {
        toast.error('Failed to create service');
      } else {
        toast.success('Service created');
        setShowForm(false);
        fetchServices();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete service');
    } else {
      toast.success('Service deleted');
      fetchServices();
    }
  };

  const toggleActive = async (svc: Service) => {
    const { error } = await supabase
      .from('services')
      .update({ is_active: !svc.is_active })
      .eq('id', svc.id);
    if (error) {
      toast.error('Failed to update service');
    } else {
      fetchServices();
    }
  };

  const moveOrder = async (svc: Service, dir: 'up' | 'down') => {
    const sorted = [...services].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((s) => s.id === svc.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const swapSvc = sorted[swapIdx];
    await supabase.from('services').update({ sort_order: swapSvc.sort_order }).eq('id', svc.id);
    await supabase.from('services').update({ sort_order: svc.sort_order }).eq('id', swapSvc.id);
    fetchServices();
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">Manage Services</h2>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid gap-4">
        {services.map((svc, i) => (
          <Card key={svc.id} className={svc.is_active ? '' : 'opacity-60'}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{svc.icon}</Badge>
                    <h3 className="font-heading font-semibold text-lg">{svc.title}</h3>
                    {!svc.is_active && <Badge variant="secondary">Hidden</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{svc.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {svc.features.map((f, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button size="icon" variant="ghost" onClick={() => moveOrder(svc, 'up')} disabled={i === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => moveOrder(svc, 'down')} disabled={i === services.length - 1}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Button size="sm" variant="outline" onClick={() => openEdit(svc)}>
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleActive(svc)}>
                  {svc.is_active ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      Show
                    </>
                  )}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(svc.id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Service' : 'Add Service'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="svc-title">Title</Label>
              <Input
                id="svc-title"
                className="mt-1.5"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="svc-desc">Description</Label>
              <Textarea
                id="svc-desc"
                className="mt-1.5"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="svc-icon">Icon</Label>
              <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((ic) => (
                    <SelectItem key={ic} value={ic}>{ic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="svc-features">Features (one per line)</Label>
              <Textarea
                id="svc-features"
                className="mt-1.5"
                rows={4}
                placeholder="Scheduled pickups&#10;Single or recurring requests"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="svc-order">Sort Order</Label>
              <Input
                id="svc-order"
                type="number"
                className="mt-1.5"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
              <Label>Active (visible on website)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============ PRICING TAB ============ */

function PricingTab() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState<PricingTier | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    features: '',
    icon: 'Leaf',
    highlight: false,
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      toast.error('Failed to load pricing tiers');
    } else {
      setTiers(data || []);
    }
    setFetching(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', price: '', description: '', features: '', icon: 'Leaf', highlight: false, sort_order: tiers.length, is_active: true });
    setShowForm(true);
  };

  const openEdit = (tier: PricingTier) => {
    setEditing(tier);
    setForm({
      name: tier.name,
      price: tier.price,
      description: tier.description,
      features: tier.features.join('\n'),
      icon: tier.icon,
      highlight: tier.highlight,
      sort_order: tier.sort_order,
      is_active: tier.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const features = form.features.split('\n').map((f) => f.trim()).filter(Boolean);
    const payload = {
      name: form.name,
      price: form.price,
      description: form.description,
      features,
      icon: form.icon,
      highlight: form.highlight,
      sort_order: form.sort_order,
      is_active: form.is_active,
    };

    if (editing) {
      const { error } = await supabase.from('pricing_tiers').update(payload).eq('id', editing.id);
      if (error) {
        toast.error('Failed to update pricing tier');
      } else {
        toast.success('Pricing tier updated');
        setShowForm(false);
        fetchTiers();
      }
    } else {
      const { error } = await supabase.from('pricing_tiers').insert(payload);
      if (error) {
        toast.error('Failed to create pricing tier');
      } else {
        toast.success('Pricing tier created');
        setShowForm(false);
        fetchTiers();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('pricing_tiers').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete pricing tier');
    } else {
      toast.success('Pricing tier deleted');
      fetchTiers();
    }
  };

  const toggleActive = async (tier: PricingTier) => {
    const { error } = await supabase
      .from('pricing_tiers')
      .update({ is_active: !tier.is_active })
      .eq('id', tier.id);
    if (error) {
      toast.error('Failed to update pricing tier');
    } else {
      fetchTiers();
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">Manage Pricing</h2>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Tier
        </Button>
      </div>

      <div className="grid gap-4">
        {tiers.map((tier) => (
          <Card key={tier.id} className={tier.is_active ? '' : 'opacity-60'}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline">{tier.icon}</Badge>
                    <h3 className="font-heading font-semibold text-lg">{tier.name}</h3>
                    {tier.highlight && <Badge>Popular</Badge>}
                    {!tier.is_active && <Badge variant="secondary">Hidden</Badge>}
                  </div>
                  <p className="text-2xl font-bold font-heading">{tier.price}</p>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tier.features.map((f, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Button size="sm" variant="outline" onClick={() => openEdit(tier)}>
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleActive(tier)}>
                  {tier.is_active ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      Show
                    </>
                  )}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(tier.id)}>
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Pricing Tier' : 'Add Pricing Tier'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tier-name">Name</Label>
              <Input
                id="tier-name"
                className="mt-1.5"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tier-price">Price (display text)</Label>
              <Input
                id="tier-price"
                className="mt-1.5"
                placeholder="₦2,000 – ₦5,000"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tier-desc">Description</Label>
              <Textarea
                id="tier-desc"
                className="mt-1.5"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tier-icon">Icon</Label>
              <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((ic) => (
                    <SelectItem key={ic} value={ic}>{ic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tier-features">Features (one per line)</Label>
              <Textarea
                id="tier-features"
                className="mt-1.5"
                rows={4}
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.highlight}
                onCheckedChange={(v) => setForm({ ...form, highlight: v })}
              />
              <Label>Highlight as "Most Popular"</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
              <Label>Active (visible on website)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============ MESSAGES TAB ============ */

function MessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Failed to load messages');
    } else {
      setMessages(data || []);
    }
    setFetching(false);
  };

  const markRead = async (msg: ContactMessage) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', msg.id);
    if (!error) fetchMessages();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete message');
    } else {
      toast.success('Message deleted');
      setSelected(null);
      fetchMessages();
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">
          Contact Messages
          {unreadCount > 0 && (
            <Badge className="ml-3">{unreadCount} unread</Badge>
          )}
        </h2>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-20">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className={`hover:shadow-md transition-shadow cursor-pointer ${!msg.is_read ? 'border-primary' : ''}`}
              onClick={() => {
                setSelected(msg);
                if (!msg.is_read) markRead(msg);
              }}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      {!msg.is_read && <span className="h-2 w-2 rounded-full bg-primary" />}
                      <h3 className="font-heading font-semibold">{msg.full_name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.email}</p>
                    {msg.subject && <p className="text-sm font-medium">{msg.subject}</p>}
                    <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject || 'Message'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs">From</p>
                    <p className="font-medium">{selected.full_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="font-medium">{selected.email}</p>
                  </div>
                  {selected.phone && (
                    <div>
                      <p className="text-muted-foreground text-xs">Phone</p>
                      <p className="font-medium">{selected.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground text-xs">Date</p>
                    <p className="font-medium">{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-muted-foreground text-xs mb-1">Message</p>
                  <p className="whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="destructive" onClick={() => handleDelete(selected.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============ SETTINGS TAB ============ */

function SettingsTab() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    hero_title: '',
    hero_subtitle: '',
    phone: '',
    email: '',
    address: '',
    whatsapp_number: '',
    facebook_url: '',
    twitter_url: '',
    instagram_url: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .maybeSingle();
    if (error) {
      toast.error('Failed to load settings');
    } else if (data) {
      setSettings(data);
      setForm({
        hero_title: data.hero_title || '',
        hero_subtitle: data.hero_subtitle || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        whatsapp_number: data.whatsapp_number || '',
        facebook_url: data.facebook_url || '',
        twitter_url: data.twitter_url || '',
        instagram_url: data.instagram_url || '',
      });
    }
    setFetching(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .update({
        hero_title: form.hero_title,
        hero_subtitle: form.hero_subtitle,
        phone: form.phone,
        email: form.email,
        address: form.address,
        whatsapp_number: form.whatsapp_number,
        facebook_url: form.facebook_url,
        twitter_url: form.twitter_url,
        instagram_url: form.instagram_url,
      })
      .eq('id', '00000000-0000-0000-0000-000000000001');
    if (error) {
      toast.error('Failed to save settings');
    } else {
      toast.success('Settings saved');
    }
    setSaving(false);
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="font-heading text-xl font-bold">Site Settings</h2>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-heading font-semibold flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Homepage
          </h3>
          <div>
            <Label htmlFor="hero-title">Hero Title</Label>
            <Input
              id="hero-title"
              className="mt-1.5"
              value={form.hero_title}
              onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
            <Textarea
              id="hero-subtitle"
              className="mt-1.5"
              rows={2}
              value={form.hero_subtitle}
              onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-heading font-semibold flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="set-phone">Phone</Label>
              <Input
                id="set-phone"
                className="mt-1.5"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="set-email">Email</Label>
              <Input
                id="set-email"
                className="mt-1.5"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="set-address">Address</Label>
              <Input
                id="set-address"
                className="mt-1.5"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="set-whatsapp">WhatsApp Number (international format, no +)</Label>
              <Input
                id="set-whatsapp"
                className="mt-1.5"
                placeholder="2349023338788"
                value={form.whatsapp_number}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-heading font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Social Media Links
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="set-fb">Facebook URL</Label>
              <Input
                id="set-fb"
                className="mt-1.5"
                placeholder="https://facebook.com/..."
                value={form.facebook_url}
                onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="set-tw">Twitter / X URL</Label>
              <Input
                id="set-tw"
                className="mt-1.5"
                placeholder="https://twitter.com/..."
                value={form.twitter_url}
                onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="set-ig">Instagram URL</Label>
              <Input
                id="set-ig"
                className="mt-1.5"
                placeholder="https://instagram.com/..."
                value={form.instagram_url}
                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} size="lg" className="w-full">
        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Save Settings
      </Button>
    </div>
  );
}
