'use client'

import React, { useState } from 'react'

export default function Home() {
  const [person1, setPerson1] = useState('')
  const [person2, setPerson2] = useState('')
  const [meetingStory, setMeetingStory] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ person1, person2, meetingStory, file })
    // Add form submission logic here
  }

  return (
    <main>
      {/* Navbar */}
      <nav className="navbar py-3 px-6">
        <div className="container mx-auto">
          <h1 className="title text-3xl md:text-4xl">CupidChaos</h1>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero min-h-screen pt-16 pb-24 px-4">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          {/* Left side content */}
          <div className="lg:w-1/2 mb-10 lg:mb-0 relative">
            {/* Heart decorations */}
            <div className="heart-decoration" style={{ top: '-50px', left: '20px', transform: 'rotate(-15deg)' }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="#FF9AAD">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="heart-decoration" style={{ bottom: '30px', right: '40px', transform: 'rotate(10deg)' }}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="#FF9AAD">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Turn Your Love Story Into a <span className="title">Hilariously Cringe</span> Storybook
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Enter your names, upload a picture, and tell us how you met. 
              We'll create an unforgettable, cheesy storybook that will make 
              you laugh, cringe, and fall in love all over again.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-10">
              <div className="flex items-center text-pink-500">
                <svg className="w-12 h-12 mr-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
                </svg>
                <span className="text-lg">Personalized Stories</span>
              </div>
              <div className="flex items-center text-pink-500">
                <svg className="w-12 h-12 mr-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span className="text-lg">Love-Filled Pages</span>
              </div>
            </div>
          </div>

          {/* Right side form */}
          <div className="lg:w-1/2 lg:pl-16">
            <div className="form-container p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Create Your Love Story</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Person 1's Name</label>
                  <input
                    type="text"
                    value={person1}
                    onChange={(e) => setPerson1(e.target.value)}
                    className="input-field w-full px-4 py-3 rounded-lg outline-none"
                    placeholder="Enter name..."
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Person 2's Name</label>
                  <input
                    type="text"
                    value={person2}
                    onChange={(e) => setPerson2(e.target.value)}
                    className="input-field w-full px-4 py-3 rounded-lg outline-none"
                    placeholder="Enter name..."
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">How Did You Meet?</label>
                  <textarea
                    value={meetingStory}
                    onChange={(e) => setMeetingStory(e.target.value)}
                    className="input-field w-full px-4 py-3 rounded-lg outline-none"
                    rows={4}
                    placeholder="Tell us your story..."
                    required
                  />
                </div>
                
                <div className="mb-8">
                  <label className="block text-gray-700 mb-2">Upload Your Picture</label>
                  <div className="border-2 border-dashed border-pink-200 rounded-lg p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-pink-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-500 mb-2">Drop your image here, or click to browse</p>
                    <input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-pink-500 hover:text-pink-600 underline text-sm"
                    >
                      Select a file
                    </label>
                    {file && (
                      <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
                    )}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn-submit w-full text-white font-bold py-3 px-4 rounded-xl"
                >
                  Generate Our Cringe Love Story!
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}