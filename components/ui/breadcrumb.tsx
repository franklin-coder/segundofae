import React from 'react'
import Link from 'next/link'

export const Breadcrumb = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <nav className={`flex ${className}`} aria-label="Breadcrumb">
    {children}
  </nav>
)

export const BreadcrumbList = ({ children }: { children: React.ReactNode }) => (
  <ol className="inline-flex items-center space-x-1 md:space-x-3">
    {children}
  </ol>
)

export const BreadcrumbItem = ({ children }: { children: React.ReactNode }) => (
  <li className="inline-flex items-center">
    {children}
  </li>
)

export const BreadcrumbLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
    {children}
  </Link>
)

export const BreadcrumbPage = ({ children }: { children: React.ReactNode }) => (
  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
    {children}
  </span>
)

export const BreadcrumbSeparator = () => (
  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
  </svg>
)
