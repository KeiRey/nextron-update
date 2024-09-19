import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Electron Auto Update</title>
      </Head>
      <div className="grid grid-cols-4 text-2xl w-full text-center">
      {['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5', 'Card 6', 'Card 7', 'Card 8'].map((card, index) => (
        <div key={index} className="p-4 m-2 border rounded shadow-lg">
          <span>{card}</span>
        </div>
      ))}
      </div>
    </React.Fragment>
  )
}
