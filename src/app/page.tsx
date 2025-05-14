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
    setSuccess("")

    try {
      const res = await axios.post("https://mixer-io.vercel.app/earlyaccess", {
        email: email,
      })

      if (res.status === 201) {
        setSuccess("You’re in! Check your inbox 🎉")
        setSubmitted(true)
      }
    } catch (error) {
      console.error("Submission error:", error)

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status

        if (status === 409) {
          setSuccess("You’ve already signed up.")
        } else if (status === 403) {
          setSuccess("Sorry, the list is full. Don’t worry, wait till we launch.")
        } else {
          setError(error.response.data?.message || "Error submitting email.")
        }
      } else {
        setError("Something went wrong. Please try again later.")
      }
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
            Ever wondered what your music <span className="italic">looks</span> like? Get early access to try our tool and make a sick poster of your top artists.
          </p>
        </CardHeader>

        <CardContent>
          {submitted ? (
            <p className="text-green-600 font-medium">
              You’re on the list! 🎉 We’ll email you soon.
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
          No spam, promise.
        </CardFooter>
      </Card>
    </div>
  )
}
