"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Cover from "./Cover";
import { jsPDF } from "jspdf";

// Define the types for our story data
interface StorySegment {
  segment: string;
  imageUrl: string;
}

interface StoryData {
  title: string;
  segments: StorySegment[];
  coverImage?: string; // This would be the user uploaded image
}

interface StoryBookProps {
  initialStoryData?: StoryData;
}

export default function StoryBook({ initialStoryData }: StoryBookProps) {
  const [storyData, setStoryData] = useState<StoryData>(
    initialStoryData || {
      title: "From Coffee Spills to Wedding Bells: A Latte Love Story! ☕💑",
      coverImage: "/api/placeholder/600/800",
      segments: [
        {
          segment: "Sarah was rushing to her morning meeting...",
          imageUrl: "/api/placeholder/400/300",
        },
        {
          segment:
            "Feeling guilty about the shirt incident, Sarah offered to buy Mike a replacement coffee. One coffee turned into two, and soon they were sharing their life stories and terrible puns over their third cup of the day.",
          imageUrl: "/api/placeholder/400/300",
        },
        {
          segment:
            "What started as a clumsy accident turned into weekly coffee dates. They discovered they both loved bad movies, hiking on rainy days, and had the same terrible taste in music that their friends always complained about.",
          imageUrl: "/api/placeholder/400/300",
        },
        {
          segment:
            "Six months later, Mike proposed in the same coffee shop where they first met - this time intentionally spilling his coffee to recreate their fateful first encounter. Sarah said yes through laughter and happy tears.",
          imageUrl: "/api/placeholder/400/300",
        },
      ],
    }
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const totalPages = storyData.segments.length + 1; // +1 for the cover page

  // Add loading state near the top of the component
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Update the calculateZIndex function
  const calculateZIndex = (index: number) => {
    if (index === -1) {
      // Cover page
      return currentPage === 0 ? totalPages : 0;
    }
    if (currentPage === index + 1) {
      return totalPages;
    }
    return totalPages - (index + 1);
  };

  // Handle page turning
  const turnPage = (direction: "next" | "prev") => {
    if (flipping) return;

    setFlipping(true);
    if (direction === "next" && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }

    setTimeout(() => {
      setFlipping(false);
    }, 1000);
  };

  // Update the generatePDF function
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      // Add cover page
      pdf.setFontSize(24);
      const titleLines = pdf.splitTextToSize(storyData.title, contentWidth);
      pdf.text(titleLines, pageWidth / 2, 40, { align: "center" });

      // Add cover image if exists
      if (storyData.coverImage) {
        try {
          const img = document.createElement("img");
          img.src = storyData.coverImage;
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          // Calculate image dimensions to fit the page while maintaining aspect ratio
          const imgAspectRatio = img.width / img.height;
          let imgWidth = contentWidth;
          let imgHeight = imgWidth / imgAspectRatio;

          if (imgHeight > pageHeight - 100) {
            imgHeight = pageHeight - 100;
            imgWidth = imgHeight * imgAspectRatio;
          }

          pdf.addImage(
            img,
            "JPEG",
            (pageWidth - imgWidth) / 2,
            60,
            imgWidth,
            imgHeight,
            undefined,
            "MEDIUM"
          );
        } catch (error) {
          console.error("Error adding cover image:", error);
        }
      }

      // Add subtitle
      pdf.setFontSize(14);
      

      // Add story segments
      for (let i = 0; i < storyData.segments.length; i++) {
        const segment = storyData.segments[i];
        pdf.addPage();

        // Add page number
        pdf.setFontSize(12);
        pdf.text(`${i + 2}`, pageWidth - margin, margin);

        // Add segment image
        try {
          const img = document.createElement("img");
          img.src = segment.imageUrl;
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          const imgAspectRatio = img.width / img.height;
          let imgWidth = contentWidth;
          let imgHeight = imgWidth / imgAspectRatio;

          if (imgHeight > pageHeight / 2) {
            imgHeight = pageHeight / 2;
            imgWidth = imgHeight * imgAspectRatio;
          }

          pdf.addImage(
            img,
            "JPEG",
            (pageWidth - imgWidth) / 2,
            40,
            imgWidth,
            imgHeight,
            undefined,
            "MEDIUM"
          );

          // Add segment text
          pdf.setFontSize(12);
          const textY = 40 + imgHeight + 20;
          const textLines = pdf.splitTextToSize(
            segment.segment.replace(/^### Segment \d+: /, ""),
            contentWidth
          );
          pdf.text(textLines, margin, textY);
        } catch (error) {
          console.error(`Error adding image for segment ${i + 1}:`, error);
          // If image fails, still add the text
          pdf.setFontSize(12);
          const textLines = pdf.splitTextToSize(segment.segment, contentWidth);
          pdf.text(textLines, margin, 40);
        }
      }

      // Add decorative elements
      for (let i = 0; i < pdf.getNumberOfPages(); i++) {
        pdf.setPage(i + 1);

        // Add page border
        pdf.setDrawColor(255, 192, 203); // Pink color
        pdf.setLineWidth(0.5);
        pdf.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);

        // Add corner decorations
        const decorSize = 10;
        pdf.setFillColor(255, 192, 203);
        pdf.circle(margin / 2, margin / 2, decorSize / 2, "F");
        pdf.circle(pageWidth - margin / 2, margin / 2, decorSize / 2, "F");
        pdf.circle(margin / 2, pageHeight - margin / 2, decorSize / 2, "F");
        pdf.circle(
          pageWidth - margin / 2,
          pageHeight - margin / 2,
          decorSize / 2,
          "F"
        );
      }

      // Save the PDF
      pdf.save(`${storyData.title.slice(0, 30)}.pdf`);
    } catch (error) {
      console.error("Error saving PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Cleanup localStorage when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem("coupleImage");
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 via-red-50 to-white py-8">
      {/* Navbar - updated styling */}
      <nav className="navbar fixed top-0 left-0 right-0 z-50 py-3 px-6 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="title text-3xl font-bold bg-gradient-to-r from-pink-500 to-red-400 text-transparent bg-clip-text">
            jabWEmet
          </h1>
          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-400 to-red-400 text-white hover:from-pink-500 hover:to-red-500 transition shadow-lg hover:shadow-pink-200"
          >
            Create New Story
          </Link>
        </div>
      </nav>

      <div className="container mx-auto pt-16 px-4 flex flex-col items-center">
        <div
          ref={bookRef}
          className="book-container w-full max-w-3xl aspect-[4/3] relative perspective-1000 mt-8"
        >
          <div
            className={`book relative w-full h-full transition-all duration-1000 transform-style-3d ${
              flipping ? "book-flipping" : ""
            }`}
            style={{
              transform: `rotateY(${currentPage * -180}deg)`,
              transformOrigin: "left center",
            }}
          >
            {/* Cover/Title Page */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                transform: "rotateY(0deg)",
                transformOrigin: "left center",
                backfaceVisibility: "hidden",
                zIndex: calculateZIndex(-1),
                transition: flipping
                  ? "transform 1s, z-index 0s"
                  : "transform 1s, z-index 0.5s",
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-pink-50 via-white to-red-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                <div className="flex-1 p-12 flex flex-col items-center justify-center">
                  {/* Title Section */}
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-8 text-center max-w-2xl leading-tight">
                    {storyData.title}
                  </h1>

                  {/* Cover Image */}
                  {storyData.coverImage && (
                    <div className="relative w-[60%] aspect-[3/4] mt-4 mx-auto">
                      {/* Background decorative elements */}
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-red-200 transform rotate-2 rounded-2xl -z-1"></div>
                      <div className="absolute inset-0 bg-gradient-to-l from-pink-200 to-red-200 transform -rotate-2 rounded-2xl -z-1"></div>

                      {/* Image container */}
                      <div className="relative w-full h-full rounded-2xl overflow-hidden border-8 border-white shadow-xl">
                        <img
                          src={storyData.coverImage}
                          alt="Cover Image"
                          className="object-cover w-full h-full"
                          style={{
                            objectFit: "cover",
                            objectPosition: "center 20%",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Subtitle - adjusted margin */}
                  <p className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-red-500 mt-8">
                    Every love story is beautiful, but ours is my favorite 💖
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
                  transformOrigin: "left center",
                  backfaceVisibility: "hidden",
                  zIndex: calculateZIndex(index),
                  transition: flipping
                    ? "transform 1s, z-index 0s"
                    : "transform 1s, z-index 0.5s",
                  display: currentPage > index + 1 ? "none" : "block",
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-white via-pink-50 to-white rounded-3xl shadow-2xl overflow-hidden flex">
                  {/* Left side (Image) */}
                  <div className="w-1/2 relative">
                    <div className="absolute inset-0 m-6 rounded-2xl overflow-hidden">
                      {/* Decorative frame */}
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-red-200 transform rotate-1"></div>
                      <div className="absolute inset-0 bg-gradient-to-l from-pink-200 to-red-200 transform -rotate-1"></div>

                      {/* Image container */}
                      <div className="relative h-full w-full p-1">
                        <div className="relative h-full w-full rounded-xl overflow-hidden border-4 border-white shadow-lg">
                          <Image
                            src={segment.imageUrl}
                            alt={`Story illustration ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side (Text) */}
                  <div className="w-1/2 p-8 flex flex-col">
                    {/* Page number with decorative elements */}
                    <div className="text-right mb-6 flex justify-end items-center">
                      <span className="relative">
                        <span className="absolute inset-0 bg-gradient-to-r from-pink-200 to-red-200 blur-lg opacity-50"></span>
                        <span className="relative text-3xl font-bold bg-gradient-to-r from-pink-500 to-red-400 text-transparent bg-clip-text">
                          {index + 2}
                        </span>
                      </span>
                    </div>

                    {/* Text content with decorative elements */}
                    <div className="flex-grow flex flex-col justify-center">
                      {/* Decorative quote marks */}
                      <div className="text-6xl text-pink-200 opacity-50 mb-4">
                        "
                      </div>

                      <p className="text-gray-700 text-lg leading-relaxed relative">
                        <span className="relative z-10">
                          {segment.segment.replace(/^### Segment \d+: /, "")}
                        </span>
                        {/* Subtle background decoration */}
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl text-pink-50 opacity-20 pointer-events-none">
                          ❤️
                        </span>
                      </p>

                      {/* Closing quote marks */}
                      <div className="text-6xl text-pink-200 opacity-50 text-right mt-4">
                        "
                      </div>
                    </div>

                    {/* Page decoration */}
                    <div className="absolute bottom-4 right-4 opacity-20">
                      <div className="text-pink-300 text-4xl">✨</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons - updated styling */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-8 z-10">
            <button
              onClick={() => turnPage("prev")}
              disabled={currentPage === 0 || flipping}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                currentPage === 0
                  ? "text-gray-300 bg-gray-100"
                  : "text-white bg-gradient-to-r from-pink-400 to-red-400 shadow-lg hover:from-pink-500 hover:to-red-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <span className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-red-500 font-bold">
              {currentPage + 1} / {totalPages}
            </span>

            <button
              onClick={() => turnPage("next")}
              disabled={currentPage === totalPages - 1 || flipping}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                currentPage === totalPages - 1
                  ? "text-gray-300 bg-gray-100"
                  : "text-white bg-gradient-to-r from-pink-400 to-red-400 shadow-lg hover:from-pink-500 hover:to-red-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Update the buttons section */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition flex items-center"
            onClick={generatePDF}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Print Story
          </button>
        </div>
      </div>

      {/* Add CSS for 3D effects and animations */}
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
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(-180deg);
          }
        }
        .book-flipping {
          animation: flipAnimation 1s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        .book {
          transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        .floating-hearts {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(
              circle at 20% 20%,
              rgba(255, 192, 203, 0.2) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(255, 182, 193, 0.2) 0%,
              transparent 50%
            );
          animation: float 8s infinite ease-in-out;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
        .book-container:hover .floating-hearts {
          animation-duration: 4s;
        }
        @media print {
          .navbar,
          button {
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
            border-radius: 24px !important;
          }
        }
      `}</style>

      {/* Add loading overlay in the JSX, just before the closing main tag */}
    
    </main>
  );
}
