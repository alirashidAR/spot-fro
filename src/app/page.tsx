"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import axios from "axios"  // Import axios

export default function PromoPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")  // For error messages
  const [success, setSuccess] = useState("")  // For success message

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Enter a valid email.")
      setSuccess("")
      return
    }

    setLoading(true)
    setError("")  // Reset error message on each submit

    try {
      const res = await axios.post("https://mixer-io.vercel.app/earlyaccess", {
        email: email, // Send email in the request body
      })

      if (res.status === 200) {
        setSuccess("You're in! Check your inbox 🎉")
        setSubmitted(true)
      } else if (res.status === 403) {
        setError("Early access is full. Please try again later.")
      } else if (res.status === 409) {
        setError("This email is already registered.")
      } else if (res.status === 400 && res.data.error) {
        setError(res.data.error)  // Handle other 400 errors
      } else {
        setError("Error submitting email.")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            🚀 Get Early Access
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            A poster that combines your top artists into a single image. 
          </p>
        </CardHeader>

        <CardContent>
          {submitted ? (
            <p className="text-green-600 font-medium">
              You're on the list! 🎉 We'll email you soon.
            </p>
          ) : (
            <div className="flex flex-col space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"  // Added unique id for the input field
                name="email"  // Added name attribute
                autoComplete="email"  // Added autocomplete attribute
              />
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Join the First 20"}
              </Button>

              {error && <p className="text-red-600 mt-2">{error}</p>}
              {success && <p className="text-green-600 mt-2">{success}</p>}
            </div>
          )}
        </CardContent>

        <CardFooter className="text-xs text-gray-400">
          I'll never spam you.
        </CardFooter>
      </Card>
    </div>
  )
}
