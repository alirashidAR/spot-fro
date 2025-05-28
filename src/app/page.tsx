"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import axios from "axios"

export default function PromoPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
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
        setSuccess("You’re on the list! If I pick you, you’ll get a DM or email from me soon 👀")
        setSubmitted(true)
      }
    } catch (error) {
      console.error("Submission error:", error)

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status

        if (status === 409) {
          setSuccess("You already signed up! If you’re in the 25, you’ll hear from me ✨")
        } else if (status === 403) {
          setSuccess("I hit the 25-person Spotify test limit for now — but I’ll ping you if that changes!")
        } else {
          setError(error.response.data?.message || "Something didn't work right. Mind trying again?")
        }
      } else {
        setError("Oops! Something went wrong. Please try again in a moment.")
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4">
      <BackgroundBeamsWithCollision className="h-screen">
        <Card className="max-w-md w-full shadow-lg z-30">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              🎵hello🎨
            </CardTitle>
            <p className="text-sm text-gray-500 mt-2">
             working on something that turns your top Spotify artists into a custom poster. Just messing around for now — Spotify only lets 25 people test it, so putting it here. 
              Drop your Spotify email if you wanna try it out. I{"’"}ll choose any 25 and send you an email with access.
            </p>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <p className="text-green-600 font-medium">
                You’re on the list!
              </p>
            ) : (
              <div className="flex flex-col space-y-4">
                <Input
                  type="email"
                  placeholder="Your Spotify email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  {loading ? "Adding you..." : "Submit"}
                </Button>

                {error && <p className="text-red-600 mt-2">{error}</p>}
                {success && <p className="text-green-600 mt-2">{success}</p>}
              </div>
            )}
          </CardContent>

          <CardFooter className="text-xs text-gray-400">
            no spam from me, promise. Won{"'"}t hack your Spotify either.
          </CardFooter>
        </Card>
      </BackgroundBeamsWithCollision>
    </div>
  )
}
