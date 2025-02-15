'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Define the types for our story data
interface StorySegment {
  segment: string
  imageUrl: string
}

interface StoryData {
  title: string
  segments: StorySegment[]
  coverImage?: string // This would be the user uploaded image
}

export default function StoryBook() {
  // For demo purposes, use dummy data
  const [storyData, setStoryData] = useState<StoryData>({
    "title": "From Coffee Spills to Wedding Bells: A Latte Love Story! ☕💑",
    "coverImage": "/api/placeholder/600/800", // This would be the user uploaded image
    "segments": [
      {
        "segment": "Sarah was rushing to her morning meeting when she literally crashed into Mike at the local coffee shop, creating a cappuccino catastrophe all over his new white shirt. Instead of getting angry, Mike couldn't help but laugh at the foam mustache Sarah accidentally acquired during the collision.",
        "imageUrl": "/api/placeholder/400/300"
      },
      {
        "segment": "Feeling guilty about the shirt incident, Sarah offered to buy Mike a replacement coffee. One coffee turned into two, and soon they were sharing their life stories and terrible puns over their third cup of the day.",
        "imageUrl": "/api/placeholder/400/300"
      },
      {
        "segment": "What started as a clumsy accident turned into weekly coffee dates. They discovered they both loved bad movies, hiking on rainy days, and had the same terrible taste in music that their friends always complained about.",
        "imageUrl": "/api/placeholder/400/300"
      },
      {
        "segment": "Six months later, Mike proposed in the same coffee shop where they first met - this time intentionally spilling his coffee to recreate their fateful first encounter. Sarah said yes through laughter and happy tears.",
        "imageUrl": "/api/placeholder/400/300"
      }
    ]
  })

  const [currentPage, setCurrentPage] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const bookRef = useRef<HTMLDivElement>(null)
  const totalPages = storyData.segments.length + 1 // +1 for cover page

  // Handle page turning
  const turnPage = (direction: 'next' | 'prev') => {
    if (flipping) return

    setFlipping(true)
    if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
    
    setTimeout(() => {
      setFlipping(false)
    }, 1000)
  }

  // In a real implementation, you would fetch data from your API here
  // useEffect(() => {
  //   const fetchStoryData = async () => {
  //     const response = await fetch('/api/story')
  //     const data = await response.json()
  //     setStoryData(data)
  //   }
  //   fetchStoryData()
  // }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8">
      {/* Navbar */}
      <nav className="navbar fixed top-0 left-0 right-0 z-50 py-3 px-6 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="title text-3xl text-pink-500">CupidChaos</h1>
          <Link 
            href="/"
            className="px-4 py-2 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200 transition"
          >
            Create New Story
          </Link>
        </div>
      </nav>

      <div className="container mx-auto pt-16 px-4 flex flex-col items-center">
        {/* Book container - adjusted aspect ratio to be more like a standard book */}
        <div 
          ref={bookRef}
          className="book-container w-full max-w-3xl aspect-[4/3] relative perspective-1000 mt-8"
        >
          {/* Book */}
          <div 
            className={`book relative w-full h-full transition-all duration-1000 transform-style-3d ${
              flipping ? 'book-flipping' : ''
            }`}
            style={{ 
              transform: `rotateY(${currentPage * -180}deg)`,
              transformOrigin: 'left center'
            }}
          >
            {/* Cover Page */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <div className="w-full h-full bg-white rounded-r-lg rounded-b-lg shadow-2xl overflow-hidden flex flex-col">
                <div className="p-8 bg-gradient-to-b from-pink-100 to-pink-200">
                  <h1 className="text-3xl md:text-4xl font-bold text-pink-800 text-center mb-4">
                    {storyData.title}
                  </h1>
                </div>
                
                {/* Centered cover image */}
                <div className="flex-1 p-8 flex items-center justify-center bg-white">
                  {storyData.coverImage && (
                    <div className="relative w-4/5 h-4/5 rounded-xl overflow-hidden shadow-lg border-8 border-pink-100">
                      <Image
                        src={storyData.coverImage}
                        alt="Cover Image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div className="bg-gradient-to-t from-pink-100 to-pink-50 p-4 flex items-center justify-center">
                  <p className="text-lg text-pink-800 italic text-center">
                    Your personal love story
                  </p>
                </div>
              </div>
            </div>

            {/* Story Pages */}
            {storyData.segments.map((segment, index) => (
              <div 
                key={index}
                className="absolute inset-0 w-full h-full"
                style={{ 
                  transform: `rotateY(${(index + 1) * 180}deg)`,
                  transformOrigin: 'left center',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="w-full h-full bg-white rounded-r-lg shadow-2xl overflow-hidden flex">
                  {/* Left side (Image) */}
                  <div className="w-1/2 relative border-r border-pink-100">
                    <div className="absolute inset-0 p-6 flex items-center justify-center">
                      <div className="w-full h-5/6 relative rounded-lg overflow-hidden shadow-inner">
                        <Image
                          src={segment.imageUrl}
                          alt={`Story illustration ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side (Text) */}
                  <div className="w-1/2 p-6 flex flex-col">
                    <div className="text-right mb-4">
                      <span className="text-2xl text-pink-400 font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-grow flex items-center">
                      <p className="text-gray-800 text-lg leading-relaxed">
                        {segment.segment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-8 z-10">
            <button
              onClick={() => turnPage('prev')}
              disabled={currentPage === 0 || flipping}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                currentPage === 0 ? 'text-gray-300 bg-gray-100' : 'text-pink-500 bg-white shadow-lg hover:bg-pink-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span className="bg-white px-4 py-2 rounded-full shadow-lg text-pink-800">
              {currentPage + 1} / {totalPages}
            </span>
            
            <button
              onClick={() => turnPage('next')}
              disabled={currentPage === totalPages - 1 || flipping}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                currentPage === totalPages - 1 ? 'text-gray-300 bg-gray-100' : 'text-pink-500 bg-white shadow-lg hover:bg-pink-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Print button */}
        <button 
          className="mt-8 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-xl shadow transition flex items-center"
          onClick={() => window.print()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Our Story
        </button>
      </div>
      
      {/* Add CSS for 3D effects */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        @keyframes flipAnimation {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-180deg); }
        }
        .book-flipping {
          animation: flipAnimation 1s ease-in-out;
        }
        @media print {
          .navbar, button {
            display: none !important;
          }
          .book-container {
            height: 100vh !important;
            width: 100vw !important;
            max-width: none !important;
          }
          .book {
            transform: none !important;
          }
          .book > div {
            position: relative !important;
            page-break-after: always;
            margin-bottom: 50px;
            transform: none !important;
          }
        }
      `}</style>
    </main>
  )
}