"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  ToggleLeft,
  ToggleRight,
  Users,
  Mail,
  Phone,
  Calendar,
  Shield,
  ChevronDown,
} from "lucide-react"
import { cn, formatDate } from "@/lib/utils"

type UserData = {
  id: string
  name: string
  email: string
  phone: string
  role: "ADMIN" | "CLIENT" | "COLLECTOR"
  status: boolean
  createdAt: Date
  avatar?: string
}

const sampleUsers: UserData[] = [
  { id: "1", name: "Fatou Diop", email: "fatou.diop@email.com", phone: "+221 77 123 45 67", role: "CLIENT", status: true, createdAt: new Date("2026-01-15") },
  { id: "2", name: "Mamadou Fall", email: "mamadou.fall@email.com", phone: "+221 76 234 56 78", role: "COLLECTOR", status: true, createdAt: new Date("2026-01-20") },
  { id: "3", name: "Aminata Sow", email: "aminata.sow@email.com", phone: "+221 77 345 67 89", role: "CLIENT", status: true, createdAt: new Date("2026-02-05") },
  { id: "4", name: "Oumar Diallo", email: "oumar.diallo@email.com", phone: "+221 70 456 78 90", role: "COLLECTOR", status: false, createdAt: new Date("2026-02-10") },
  { id: "5", name: "Ndeye Ndiaye", email: "ndeye.ndiaye@email.com", phone: "+221 76 567 89 01", role: "CLIENT", status: true, createdAt: new Date("2026-03-01") },
  { id: "6", name: "Ibrahima Kane", email: "ibrahima.kane@email.com", phone: "+221 77 678 90 12", role: "ADMIN", status: true, createdAt: new Date("2026-03-15") },
  { id: "7", name: "Aïcha Ba", email: "aicha.ba@email.com", phone: "+221 70 789 01 23", role: "CLIENT", status: true, createdAt: new Date("2026-04-01") },
  { id: "8", name: "Cheikh Thioune", email: "cheikh.thioune@email.com", phone: "+221 76 890 12 34", role: "COLLECTOR", status: true, createdAt: new Date("2026-04-10") },
  { id: "9", name: "Marième Sy", email: "marieme.sy@email.com", phone: "+221 77 901 23 45", role: "CLIENT", status: false, createdAt: new Date("2026-04-20") },
  { id: "10", name: "Papa Sarr", email: "papa.sarr@email.com", phone: "+221 70 012 34 56", role: "ADMIN", status: true, createdAt: new Date("2026-05-01") },
]

const roleBadge: Record<string, "default" | "secondary" | "outline"> = {
  ADMIN: "default",
  COLLECTOR: "secondary",
  CLIENT: "outline",
}

const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  COLLECTOR: "Collecteur",
  CLIENT: "Client",
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>(sampleUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "CLIENT" as "ADMIN" | "CLIENT" | "COLLECTOR",
  })

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "clients" && u.role === "CLIENT") ||
      (activeTab === "collectors" && u.role === "COLLECTOR") ||
      (activeTab === "admins" && u.role === "ADMIN")
    return matchesSearch && matchesTab
  })

  function handleToggleStatus(id: string) {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: !u.status } : u)))
  }

  function handleDeleteUser(id: string) {
    setUsers(users.filter((u) => u.id !== id))
  }

  function handleAddUser() {
    const newUser: UserData = {
      id: String(Date.now()),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: true,
      createdAt: new Date(),
    }
    setUsers([newUser, ...users])
    setFormData({ name: "", email: "", phone: "", role: "CLIENT" })
    setIsAddDialogOpen(false)
  }

  function handleEditUser() {
    if (!editingUser) return
    setUsers(
      users.map((u) =>
        u.id === editingUser.id
          ? { ...u, name: formData.name, email: formData.email, phone: formData.phone, role: formData.role }
          : u
      )
    )
    setEditingUser(null)
    setFormData({ name: "", email: "", phone: "", role: "CLIENT" })
    setIsEditDialogOpen(false)
  }

  function openEditDialog(user: UserData) {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, phone: user.phone, role: user.role })
    setIsEditDialogOpen(true)
  }

  function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {users.length} utilisateurs inscrits sur la plateforme
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="size-4" />
            Ajouter un utilisateur
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Créez un nouveau compte utilisateur sur la plateforme.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Nom complet</label>
                <Input
                  placeholder="Ex: Fatou Diop"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="fatou@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Téléphone</label>
                <Input
                  placeholder="+221 77 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Rôle</label>
                <Select
                  value={formData.role}
                  onValueChange={(v) => setFormData({ ...formData, role: (v ?? "CLIENT") as "ADMIN" | "CLIENT" | "COLLECTOR" })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">Client</SelectItem>
                    <SelectItem value="COLLECTOR">Collecteur</SelectItem>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter showCloseButton>
              <DialogClose render={<Button variant="outline" />}>
                Annuler
              </DialogClose>
              <Button onClick={handleAddUser} disabled={!formData.name || !formData.email}>
                Créer l&apos;utilisateur
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">
                Tous
                <Badge variant="secondary" className="ml-1.5">{users.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="clients">
                Clients
                <Badge variant="secondary" className="ml-1.5">{users.filter((u) => u.role === "CLIENT").length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="collectors">
                Collecteurs
                <Badge variant="secondary" className="ml-1.5">{users.filter((u) => u.role === "COLLECTOR").length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="admins">
                Administrateurs
                <Badge variant="secondary" className="ml-1.5">{users.filter((u) => u.role === "ADMIN").length}</Badge>
              </TabsTrigger>
            </TabsList>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Rechercher un utilisateur..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Inscrit le</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          Aucun utilisateur trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar size="sm">
                                {user.avatar && <AvatarImage src={user.avatar} />}
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.phone}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={roleBadge[user.role]}>{roleLabels[user.role]}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "size-2 rounded-full",
                                  user.status ? "bg-emerald-500" : "bg-muted-foreground"
                                )}
                              />
                              <span className="text-xs text-muted-foreground">
                                {user.status ? "Actif" : "Inactif"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => openEditDialog(user)}
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleToggleStatus(user.id)}
                              >
                                {user.status ? (
                                  <ToggleRight className="size-3.5 text-emerald-500" />
                                ) : (
                                  <ToggleLeft className="size-3.5 text-muted-foreground" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="size-3.5 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de {editingUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Nom complet</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Rôle</label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData({ ...formData, role: (v ?? formData.role) as "ADMIN" | "CLIENT" | "COLLECTOR" })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLIENT">Client</SelectItem>
                  <SelectItem value="COLLECTOR">Collecteur</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter showCloseButton>
            <DialogClose render={<Button variant="outline" />}>
              Annuler
            </DialogClose>
            <Button onClick={handleEditUser}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
