"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import axios from "axios"

export default function PromoPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Enter a valid email.")
      setSuccess("")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await axios.post("https://mixer-io.vercel.app/earlyaccess", {
        email: email,
      })

      if (res.status === 200) {
        setSuccess("You&rsquo;re in! Check your inbox 🎉")
        setSubmitted(true)
      }else if (res.status === 403) {
        setSuccess("Sorry, the list is full. Dont worry, wait till we launch.")
      }
      else if (res.status === 409) {
        setSuccess("You&rsquo;ve already signed up.")
      } 
      else {
        setError(res.data.message || "Error submitting email.")
      }
    } catch (error) {
      console.error("Submission error:", error) // ✅ Now using the error
      setError("Something went wrong.")
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
              You&rsquo;re on the list! 🎉 We&rsquo;ll email you soon.
            </p>
          ) : (
            <div className="flex flex-col space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
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
          I&rsquo;ll never spam you.
        </CardFooter>
      </Card>
    </div>
  )
}
