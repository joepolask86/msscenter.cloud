"use client"

import * as React from "react"
import Link from "next/link"
import {
  Folder,
  FolderOpen,
  Settings,
  Plus,
  Upload,
  Trash2,
  Copy,
  Move,
  Pencil,
  Search,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  FileText,
  Bot,
  Activity,
  Globe,
  MapPinned,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ArrowUp,
  Info,
  FileInput,
  Codesandbox,
  CheckIcon,
  X,
  CheckCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Mock Data
const projectGroups = [
  {
    id: "g1",
    name: "Ann Arbor Concrete Pros",
    count: 4,
    items: [
      { id: "33584", name: "plumber Denver", date: "Wed Jan 07 2026", isProWizard: true, status: "completed", totalPages: 15, indexedPages: 12 },
      { id: "33583", name: "plumber Denver", date: "Wed Jan 07 2026", isProWizard: true, status: "processing", totalPages: 10, indexedPages: 0 },
      { id: "33582", name: "plumber Denver", date: "Wed Jan 07 2026", isProWizard: true, status: "completed", totalPages: 8, indexedPages: 8 },
      { id: "7094", name: "concrete repair ann arbor", date: "Thu Jul 11 2024", isProWizard: true, status: "completed", totalPages: 5, indexedPages: 5 },
    ]
  },
  {
    id: "g2",
    name: "Somerville Plumbing Pros",
    count: 1,
    items: [
      { id: "7095", name: "https://plumbersomerville.net", date: "Thu Jul 11 2024", isProWizard: false, status: "completed", totalPages: 12, indexedPages: 10 }
    ]
  },
  {
    id: "g3",
    name: "West Hartford Electricians",
    count: 0,
    items: []
  },
  {
    id: "g4",
    name: "Temecula TreeCare Pros",
    count: 0,
    items: []
  },
  {
    id: "g5",
    name: "Skokie Appliance Pros",
    count: 0,
    items: []
  },
  {
    id: "g6",
    name: "Hialeah AC Pros",
    count: 0,
    items: []
  }
]

export function ProjectsView() {
  const [openGroupId, setOpenGroupId] = React.useState<string | null>(null)
  const [showScrollTop, setShowScrollTop] = React.useState(false)

  const toggleGroup = (id: string) => {
    setOpenGroupId(prev => prev === id ? null : id)
  }

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6 bg-background min-h-screen">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for Project..."
            className="pl-10 bg-card border-border"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <NewProjectDialog />
          {openGroupId && (
            <>
              <AuditDialog />
              <ProWizardDialog />
            </>
          )}
        </div>
      </div>

      {/* Project List */}
      <div className="space-y-3">
        {projectGroups.map((group) => (
          <Collapsible
            key={group.id}
            open={openGroupId === group.id}
            onOpenChange={() => toggleGroup(group.id)}
            className="bg-card rounded-lg border border-border overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors group/row">
              <div className="flex items-center gap-3 flex-1">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer select-none">
                    {openGroupId === group.id ? (
                      <FolderOpen className={cn("h-6 w-6 text-foreground transition-all")} />
                    ) : (
                      <Folder className={cn("h-6 w-6 text-muted-foreground transition-all group-hover/row:text-foreground")} />
                    )}
                    <span className="font-medium text-foreground">
                      {group.name} ({group.count})
                    </span>
                  </div>
                </CollapsibleTrigger>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <EditProjectDialog
                        trigger={
                          <Button variant="ghost" size="icon-xs" className="[&_svg:not([class*='size-'])]:size-4 text-muted-foreground hover:text-foreground cursor-pointer">
                            <Settings className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Folder Settings</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <AlertDialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button size="icon-sm" className="bg-destructive hover:bg-destructive/90 cursor-pointer text-white">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Folder</p>
                    </TooltipContent>
                  </Tooltip>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the folder
                        <span className="font-semibold"> "{group.name}"</span> and all projects within it.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                        Delete Folder
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <CollapsibleContent>
              {group.items.length > 0 && (
                <div className="border-t border-border px-4 py-3">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-border">
                        <TableHead className="w-[50px]">
                          <Checkbox />
                        </TableHead>
                        <TableHead className="w-[100px]">
                          <div className="flex items-center gap-1">
                            ID
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            Project Name
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </TableHead>
                        <TableHead className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            Created Date
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </TableHead>
                        <TableHead className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            Status
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </TableHead>
                        <TableHead className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            Pages
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.items.map((item) => (
                        <TableRow key={item.id} className="border-b border-border hover:bg-muted/50">
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="text-muted-foreground font-medium">
                            {item.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">
                                {item.isProWizard && <span className="font-bold text-primary mr-1">Pro WIZARD -</span>}
                                {!item.isProWizard && <span className="font-bold text-orange-600 mr-1">AUDIT -</span>}
                                {item.name}
                              </span>
                              <Button variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-foreground">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {item.date}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={item.status === "completed" ? "default" : item.status === "processing" ? "secondary" : "outline"}
                              className={item.status === "completed" ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {item.indexedPages} / {item.totalPages}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link href={`/research/${item.id}/overview`}>
                                    <Button size="icon-sm" className="bg-primary hover:bg-primary/90 cursor-pointer text-white">
                                      <FileInput className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Load this project</p>
                                </TooltipContent>
                              </Tooltip>
                              <AlertDialog>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertDialogTrigger asChild>
                                      <Button size="icon-sm" className="bg-destructive hover:bg-destructive/90 cursor-pointer text-white">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Remove this project permanently</p>
                                  </TooltipContent>
                                </Tooltip>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to permanently delete the project
                                      <span className="font-semibold"> "{item.name}"</span> (ID: {item.id})?
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                                      Delete Project
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          size="icon"
          className="fixed bottom-6 right-6 rounded-full bg-[#1e3a5f] hover:bg-[#152d4a] text-white shadow-lg z-50"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

function NewProjectDialog() {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button size="icon" className="cursor-pointer text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>New Project</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0">
        <DialogHeader className="py-4 px-6 border-b shrink-0">
          <DialogTitle className="text-primary text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" /> Create New Folder
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-6 px-6">
          <div className="space-y-2">
            <Label htmlFor="folder-name" className="text-base font-medium">Folder name</Label>
            <Input id="folder-name" placeholder="e.g. Folder 1" className="bg-muted/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="search-engine" className="text-base font-medium">Search Engine</Label>
              <Select>
                <SelectTrigger id="search-engine" className="bg-muted/30 w-full">
                  <SelectValue placeholder="Select a Search Engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="bing">Bing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language" className="text-base font-medium">Language</Label>
              <Select>
                <SelectTrigger id="language" className="bg-muted/30 w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="country" className="text-base font-medium">Country</Label>
              <Select>
                <SelectTrigger id="country" className="bg-muted/30 w-full">
                  <SelectValue placeholder="Select a Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-medium">Location</Label>
              <Select>
                <SelectTrigger id="location" className="bg-muted/30 w-full">
                  <SelectValue placeholder="Select a Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="la">Los Angeles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 p-4 border-foreground/10 rounded-lg bg-orange-300/10 text-foreground/70 text-sm">
            <Info className="h-4 w-4 shrink-0 text-foreground/70" />
            <p>
              Create new folder with default search engines & language and Country & locations. This can be updated at any time.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 py-6 pt-0 px-6">
          <DialogTrigger asChild>
            <Button variant="outline" className="px-6">Close</Button>
          </DialogTrigger>
          <Button className="bg-primary hover:bg-primary/90 cursor-pointer px-6 text-white">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Save
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditProjectDialog({ trigger }: { trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0">
        <DialogHeader className="py-4 px-6 border-b shrink-0">
          <DialogTitle className="text-primary text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" /> Edit Project
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-6 px-6">
          <div className="space-y-2">
            <Label htmlFor="edit-folder-name" className="text-base font-medium">Folder name</Label>
            <Input id="edit-folder-name" defaultValue="Ann Arbor Concrete Pros" className="bg-muted/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="edit-search-engine" className="text-base font-medium">Search Engine</Label>
              <Select defaultValue="google">
                <SelectTrigger id="edit-search-engine" className="bg-muted/30 w-full">
                  <SelectValue placeholder="Select a Search Engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="bing">Bing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-language" className="text-base font-medium">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="edit-language" className="bg-muted/30 w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="edit-country" className="text-base font-medium">Country</Label>
              <Select defaultValue="us">
                <SelectTrigger id="edit-country" className="bg-muted/30 w-full">
                  <SelectValue placeholder="Select a Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location" className="text-base font-medium">Location</Label>
              <Select defaultValue="ny">
                <SelectTrigger id="edit-location" className="bg-muted/30 w-full">
                  <SelectValue placeholder="Select a Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="la">Los Angeles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 p-4 border-foreground/10 rounded-lg bg-orange-300/10 text-foreground/70 text-sm">
            <Info className="h-4 w-4 shrink-0 text-foreground/70" />
            <p>
              Update folder settings including name, search preferences, and default configurations for all projects within this folder.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 py-6 pt-0 px-6">
          <DialogTrigger asChild>
            <Button variant="outline" className="px-6">Close</Button>
          </DialogTrigger>
          <Button className="bg-primary hover:bg-primary/90 cursor-pointer px-6 text-white">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Save Changes
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AuditDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="btn-primary cursor-pointer text-white">
          <Search className="h-4 w-4" /> Audit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0">
        <DialogHeader className="py-4 px-6 border-b shrink-0">
          <DialogTitle className="text-primary text-lg flex items-center gap-2">
            <Search className="h-5 w-5" /> Audit Website
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-6 px-6">

          <div className="flex gap-3 p-4 border-foreground/10 rounded-lg bg-orange-300/10 text-foreground/70 text-sm">
            <Info className="h-4 w-4 shrink-0 text-foreground/70" />
            <p className="flex gap-2">
              You are about to run an operation that will scan your competitors website and automatically create groups according to their posts and pages. We're also going to try and detect relevant keywords that they are ranking for and populate the groups with them.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="domain" className="mb-3">Domain:</Label>
              <Input id="domain" placeholder="ex. competitordomain.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="mb-3">Location:</Label>
              <Select defaultValue="us">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States (en)</SelectItem>
                  <SelectItem value="uk">United Kingdom (en)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="exact-match">Exact Match URL</Label>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center pt-2">
                <Switch />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-keyword" className="mb-3">Filter results to only contain keyword below:</Label>
              <Input id="filter-keyword" placeholder="keyword" />
            </div>
          </div>

        </div>

        <DialogFooter className="gap-2 py-6 pt-0 px-6">
          <Button type="button" className="bg-primary hover:bg-primary/90 cursor-pointer px-4 text-white">
            <Search className="h-4 w-4" /> Run Audit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Loading Squares Component
function LoadingSquares({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-8">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-22 h-22">
        <rect fill="#FF6000" stroke="#FF6000" strokeWidth="2" width="20" height="20" x="25" y="85">
          <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
        </rect>
        <rect fill="#FF6000" stroke="#FF6000" strokeWidth="2" width="20" height="20" x="85" y="85">
          <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
        </rect>
        <rect fill="#FF6000" stroke="#FF6000" strokeWidth="2" width="20" height="20" x="145" y="85">
          <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
        </rect>
      </svg>
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">(Please do not close, refresh or leave this page)</p>
      </div>
    </div>
  )
}

function ProWizardDialog() {
  const [step, setStep] = React.useState(0)
  const [city, setCity] = React.useState("")
  const [keyword, setKeyword] = React.useState("")
  const [searchEngine, setSearchEngine] = React.useState("google-us")
  const [searchLocation, setSearchLocation] = React.useState("us")
  const [filterKeyword, setFilterKeyword] = React.useState("")
  const [filterEnabled, setFilterEnabled] = React.useState(false)
  const [pageUrlOnly, setPageUrlOnly] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isScheduling, setIsScheduling] = React.useState(false)
  const [schedulingComplete, setSchedulingComplete] = React.useState(false)
  const [selectedResults, setSelectedResults] = React.useState<number[]>([])
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [isSwapped, setIsSwapped] = React.useState(false)

  const seedKeyword = keyword && city
    ? (isSwapped ? `${city} ${keyword}` : `${keyword} ${city}`)
    : keyword

  const handleSearch = async () => {
    setIsLoading(true)
    // Simulate API call to fetch search results
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsLoading(false)
    setStep(3)
  }

  const handleFinish = async () => {
    setIsScheduling(true)
    // Simulate API call to schedule jobs
    await new Promise(resolve => setTimeout(resolve, 3000))
    setSchedulingComplete(true)
    // Show success message for 3 seconds before closing
    await new Promise(resolve => setTimeout(resolve, 3000))
    // Close dialog and reset all state
    setDialogOpen(false)
    setIsScheduling(false)
    setSchedulingComplete(false)
    setStep(0)
    setSelectedResults([])
    // Reset all form fields
    setCity("")
    setKeyword("")
    setSearchEngine("google-us")
    setSearchLocation("us")
    setFilterKeyword("")
    setFilterEnabled(false)
    setPageUrlOnly(false)
    setIsSwapped(false)
  }

  const toggleResultSelection = (index: number) => {
    setSelectedResults(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const selectAllRecommended = () => {
    const recommendedIndices = mockResults
      .map((result, idx) => result.status === "recommended" ? idx : -1)
      .filter(idx => idx !== -1)
    setSelectedResults(recommendedIndices)
  }

  const swapWords = () => {
    // Toggle the word order in the seed keyword display
    setIsSwapped(!isSwapped)
  }

  // Mock SERP Results
  const mockResults = [
    { url: "https://www.goodguystreeservice.com/", title: "Good Guys Tree Service - Tree Trimming Austin TX", status: "recommended", description: "Good Guys Tree Service is a family-owned and operated business that has been serving the Austin, TX area for over 20 years. Call us today for best service" },
    { url: "https://www.davey.com/residential-tree-services/local-offices/austin-tree-service/", title: "Davey Tree Services In Austin, Texas", status: "neutral", description: "Davey Tree Services is a family-owned and operated business that has been serving the Austin, TX area for over 20 years." },
    { url: "https://www.yelp.com/search?find_desc=Tree+Trimming+Service&find_loc=Austin%2C+TX", title: "TOP 10 BEST Tree Trimming Service in Austin, TX", status: "not_recommended", description: "Yelp aggregator page with mixed reviews and listings from various tree service providers in the Austin area." },
    { url: "https://www.arborcaretx.com/", title: "Tree Removal & Tree Trimming Services | Austin, TX", status: "recommended", description: "Professional tree care services including removal, trimming, and emergency services for residential and commercial properties." },
    { url: "https://www.angi.com/tree-service-austin-tx/", title: "Tree Service in Austin, TX - Angi", status: "not_recommended", description: "Angi directory listing for tree services in Austin with contractor reviews and pricing information." },
  ]

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="btn-primary cursor-pointer text-white">
          <Bot className="h-4 w-4" /> Project Wizard
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] pb-8">
        {/* Header - Only show on step 0 */}
        {step === 0 && (
          <DialogHeader className="text-center px-12 pt-6 pb-4">
            <DialogTitle className="text-2xl font-bold">
              <span className="text-4xl font-bold text-center flex items-center justify-center gap-2 mb-4">
                <Codesandbox className="!size-10 text-orange-600" /> MSSCenter
              </span>
              Welcome to Project Wizard!</DialogTitle>
            <DialogDescription className="text-base mt-2 px-12">
              Entity-First SEO Research: Analyze top-ranking competitors to extract entities, build optimal site structure, and create content that ranks.
            </DialogDescription>
          </DialogHeader>
        )}

        {/* Step Indicators - Only show on steps 1-3 */}
        {step > 0 && (
          <>
            <DialogHeader className="text-center px-12 pt-6">
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <span className="text-md font-normal text-muted-foreground">AI Wizard by</span>
                <Codesandbox className="!size-5 text-orange-600" />
                <span className="text-foreground font-semibold">MSSCenter</span>
              </DialogTitle>
            </DialogHeader>

            {/* Tab-style Step Indicators */}
            <div className="flex items-center justify-center gap-2 mb-2 border border-border rounded-md p-1 mx-8">
              <div
                className={cn("flex rounded-md flex-1 items-center justify-center gap-2 px-6 py-3 cursor-pointer transition-all relative",
                  step === 1
                    ? "bg-orange-400/70 text-white rounded-t-md"
                    : step > 1
                      ? "bg-muted text-muted-foreground rounded-t-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                onClick={() => step > 1 && setStep(1)}
              >
                <span className="flex items-center justify-center font-semibold text-xl left-4 absolute">
                  1
                </span>
                <span className="font-semibold text-xl">Location</span>
              </div>

              <div
                className={cn("flex rounded-md flex-1 items-center justify-center gap-2 px-6 py-3 cursor-pointer transition-all relative",
                  step === 2
                    ? "bg-orange-400/70 text-white rounded-t-md"
                    : step > 2
                      ? "bg-muted text-muted-foreground rounded-t-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                onClick={() => step > 2 && setStep(2)}
              >
                <span className="flex items-center justify-center font-semibold text-xl left-4 absolute">
                  2
                </span>
                <span className="font-semibold text-xl">Services</span>
              </div>

              <div
                className={cn("flex rounded-md flex-1 items-center justify-center gap-2 px-6 py-3 cursor-pointer transition-all relative",
                  step === 3
                    ? "bg-orange-400/70 text-white rounded-t-md"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <span className="flex items-center justify-center font-semibold text-xl left-4 absolute">
                  3
                </span>
                <span className="font-semibold text-xl">Result</span>
              </div>
            </div>
          </>
        )}

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-8 pt-0">
          {/* Step 0: Mode Selection */}
          {step === 0 && (
            <div className="flex flex-1 items-center justify-center gap-6 py-0">
              <div
                className="flex flex-col items-center justify-center p-8 py-4 border-1 border-muted hover:border-primary rounded-xl cursor-pointer bg-card shadow-sm hover:shadow-md transition-all w-72 text-center gap-4 group"
                onClick={() => setStep(1)}
              >
                <div className="w-16 h-16 shrink-0">
                  <svg className="w-full h-full block" width="64px" height="64px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 6H12.01M9 20L3 17V4L5 5M9 20L15 17M9 20V14M15 17L21 20V7L19 6M15 17V14M15 6.2C15 7.96731 13.5 9.4 12 11C10.5 9.4 9 7.96731 9 6.2C9 4.43269 10.3431 3 12 3C13.6569 3 15 4.43269 15 6.2Z" stroke="#ff830f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </div>
                <div>
                  <h3 className="text-2xl text-foreground">Local</h3>
                  <p className="text-sm text-muted-foreground mt-2">Use for any sites that target geographic locations, for example: Lead Gen, Rank & Rent, Client SEO, etc.</p>
                </div>
                <span className="text-sm font-semibold underline mt-2">GET STARTED</span>
              </div>
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="flex flex-col flex-1 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="mb-4">In what <span className="font-bold underline">City</span> is your Business located at?</Label>
                  <Input
                    id="city"
                    placeholder="e.g. dallas"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-12"
                    autoComplete="off"
                  />
                  <p className="text-xs text-muted-foreground">You can leave this empty, however, it is always recommended to include City for your Businesses.</p>
                </div>
              </div>

              <div className="mt-auto flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(0)} className="cursor-pointer">Cancel <X className="ml-2 h-4 w-4" /></Button>
                <Button className="cursor-pointer" onClick={() => setStep(2)}>
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Services */}
          {step === 2 && (
            <>
              {isLoading ? (
                <LoadingSquares message="Loading..." />
              ) : (
                <div className="flex flex-col flex-1 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyword" className="mb-2">Enter a <span className="font-bold underline">Keyword</span> that best describes your Business</Label>
                      <Input
                        id="keyword"
                        placeholder="e.g. plumber"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="h-12"
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="mb-2">Search Engine</Label>
                        <Select value={searchEngine} onValueChange={setSearchEngine}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="google-us">google.com (United States/English)</SelectItem>
                            <SelectItem value="google-uk">google.co.uk (United Kingdom/English)</SelectItem>
                            <SelectItem value="google-ca">google.ca (Canada/English)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="mb-2">Search Location</Label>
                        <Select value={searchLocation} onValueChange={setSearchLocation}>
                          <SelectTrigger className="w-full h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="mb-2">Seed Keyword for your website is:</Label>
                      <div className="flex gap-2 bg-muted rounded-md border border-border p-2">
                        <div className="flex-1 px-4 py-2 h-10 text-[18px] text-foreground">
                          {seedKeyword || "Enter keyword and city"}
                        </div>
                        <Button disabled={!seedKeyword} className="h-10 cursor-pointer bg-foreground/10 hover:bg-foreground/20 text-foreground" onClick={swapWords}>
                          <RefreshCw className="h-4 w-4" /> Swap words
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">If you feel the keyword is correct, press Search to continue, if not go back to make adjustments.</p>
                    </div>

                    <div className="flex gap-3 p-4 border border-foreground/10 rounded-lg bg-orange-300/10 text-foreground/70 text-sm">
                      <Info className="h-4 w-4 shrink-0 text-foreground/70" />
                      <p>
                        By clicking on Search button we will pull Top 10 competitor websites on Google for provided keyword which will be presented on the next step.
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="cursor-pointer" disabled={isLoading}>Cancel <X className="ml-2 h-4 w-4" /></Button>
                    <Button className="cursor-pointer" onClick={handleSearch} disabled={!seedKeyword || isLoading}>
                      Search <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Scheduling State - After Step 3 */}
          {isScheduling && (
            <div className="flex flex-col items-center justify-center py-4 gap-8">
              {!schedulingComplete ? (
                <LoadingSquares message="Scheduling jobs..." />
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCheck className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-xl font-semibold text-foreground">Jobs Scheduled Successfully!</p>
                  <p className="text-sm text-muted-foreground">Closing...</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && !isLoading && !isScheduling && (
            <div className="flex flex-col flex-1 gap-6">
              <div className="flex gap-3 p-4 border border-foreground/10 rounded-lg bg-orange-300/10 text-foreground/70 text-sm">
                <Info className="h-4 w-4 shrink-0 text-foreground/70" />
                <p>
                  Select the top-ranking competitors below. We'll analyze their content to extract entities, identify content patterns, and build your optimal site structure based on what's actually ranking.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Filter results to only contain keyword below</Label>
                  <div className="flex items-center gap-2">
                    <Switch checked={filterEnabled} onCheckedChange={setFilterEnabled} />
                    <Input
                      placeholder={city || "keyword"}
                      value={filterKeyword}
                      onChange={(e) => setFilterKeyword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={searchLocation} onValueChange={setSearchLocation}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States (en)</SelectItem>
                      <SelectItem value="ca">Canada (en)</SelectItem>
                      <SelectItem value="uk">United Kingdom (en)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Switch checked={pageUrlOnly} onCheckedChange={setPageUrlOnly} />
                  <Label className="cursor-pointe">Find ranking keywords from Page URL only</Label>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90 cursor-pointer h-10" onClick={selectAllRecommended}>
                    <CheckCheck className="h-4 w-4" /> Select All Recommended
                  </Button>
                </div>
              </div>

              {/* SERP Results List */}
              <div className="flex-1 space-y-4">
                {mockResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-card border border-border rounded-md hover:border-primary transition-colors"
                  >
                    <Checkbox
                      checked={selectedResults.includes(idx)}
                      onCheckedChange={() => toggleResultSelection(idx)}
                    />
                    <div className="flex-1 min-w-0 relative">
                      {result.status === "recommended" && (
                        <Badge className="bg-[#1e3a5f] hover:bg-[#152d4a] text-white text-xs absolute -top-5 right-0 z-10">RECOMMENDED</Badge>
                      )}
                      {result.status === "not_recommended" && (
                        <Badge variant="destructive" className="text-white text-xs absolute -top-5 right-0 z-10">NOT RECOMMENDED</Badge>
                      )}
                      <p className={cn(
                        "text-xs truncate mb-2",
                        result.status === "not_recommended" ? "text-muted-foreground/50" : "text-foreground/80"
                      )}>{result.url}</p>
                      <p className={cn(
                        "text-[16px] font-medium hover:underline",
                        result.status === "not_recommended" ? "text-muted-foreground/50" : "text-blue-800"
                      )}>{result.title}</p>
                      <p className={cn(
                        "text-xs leading-relaxed",
                        result.status === "not_recommended" ? "text-muted-foreground/50" : "text-foreground/80"
                      )}>{result.description}</p>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end items-right gap-2">
                  <span className="rounded-full border border-border px-3 py-1 bg-primary text-white cursor-pointer">1</span>
                  <span className="rounded-full border border-border px-3 py-1 cursor-pointer">2</span>
                </div>
              </div>

              <div className="mt-auto flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)} className="cursor-pointer" disabled={isScheduling}>Cancel <X className="ml-2 h-4 w-4" /></Button>
                <Button
                  className="bg-primary hover:bg-primary/90 cursor-pointer"
                  onClick={handleFinish}
                  disabled={isScheduling || selectedResults.length < 2}
                >
                  <CheckIcon className="h-4 w-4" /> Finish {selectedResults.length > 0 && `(${selectedResults.length} selected)`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog >
  )
}
