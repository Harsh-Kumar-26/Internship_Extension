"use client"

import { useState } from "react"
import { LogOut, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ViewInternships } from "./view-internships"

export function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [internships, setInternships] = useState([])

  const handleCreateInternship = (data) => {
    const newInternship = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toLocaleDateString(),
    }
    setInternships([...internships, newInternship])
    setCurrentPage("view")
  }

  const handleLogout = () => {
    // Handle logout logic here
    alert("Logged out successfully!")
    // In a real app, you'd clear auth tokens and redirect
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-primary">Admin Panel</h1>
          <p className="text-sm text-sidebar-foreground/60 mt-1">Internship Management</p>
        </div>

        <nav className="flex-1 p-6">
          <div className="space-y-3">
            <Button
              onClick={() => setCurrentPage("dashboard")}
              variant={currentPage === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                currentPage === "dashboard"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Eye className="w-5 h-5" />
              Dashboard
            </Button>

            <Button
              onClick={() => setCurrentPage("create")}
              variant={currentPage === "create" ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                currentPage === "create"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Plus className="w-5 h-5" />
              Create Internship
            </Button>

            <Button
              onClick={() => setCurrentPage("view")}
              variant={currentPage === "view" ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                currentPage === "view"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Eye className="w-5 h-5" />
              View All Internships
            </Button>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-sidebar-border">
          <Button onClick={handleLogout} variant="destructive" className="w-full justify-start gap-3">
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border p-6">
          <h2 className="text-3xl font-bold text-foreground">
            {currentPage === "dashboard" && "Dashboard"}
            {currentPage === "create" && "Create New Internship"}
            {currentPage === "view" && "All Internships"}
          </h2>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {currentPage === "dashboard" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card rounded-lg p-6 border border-border">
                  <p className="text-muted-foreground text-sm">Total Internships</p>
                  <p className="text-4xl font-bold mt-2">{internships.length}</p>
                </div>
                <div className="bg-card rounded-lg p-6 border border-border">
                  <p className="text-muted-foreground text-sm">Active This Month</p>
                  <p className="text-4xl font-bold mt-2">0</p>
                </div>
                <div className="bg-card rounded-lg p-6 border border-border">
                  <p className="text-muted-foreground text-sm">Pending Review</p>
                  <p className="text-4xl font-bold mt-2">0</p>
                </div>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="flex gap-3">
                  <Button onClick={() => setCurrentPage("create")} size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Internship
                  </Button>
                  <Button onClick={() => setCurrentPage("view")} variant="outline" size="lg">
                    <Eye className="w-5 h-5 mr-2" />
                    View Internships
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentPage === "create" && <CreateInternForm onSubmit={handleCreateInternship} />}

          {currentPage === "view" && <ViewInternships internships={internships} />}
        </div>
      </main>
    </div>
  )
}
