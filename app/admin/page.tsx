"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, LogOut, Shield } from "lucide-react"
import { AdminUsers } from "@/components/admin/admin-users"
import { AdminEvents } from "@/components/admin/admin-events"
import { AdminStats } from "@/components/admin/admin-stats"

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication and admin role
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)

    // Check if user has admin role
    if (parsedUser.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading admin panel...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">EventHub Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Admin Access
              </Badge>
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Manage users, events, and platform settings</p>
        </motion.div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminStats />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="events">
            <AdminEvents />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
