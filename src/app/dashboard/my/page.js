"use client";

import { sendXLM } from "@/app/helper";
import NavigationBar from "@/app/NavigationBar";
import { listNfts } from "@/list";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const MyPage = () => {
  const mintNFT = async () => {
    listNfts(localStorage.getItem("private"));
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 mb-[40px]">
      <h1 className="text-4xl font-bold mb-6" onClick={mintNFT}>
        SecureTik
      </h1>
      <div className="w-full flex flex-col gap-[15px]">
        <h3 className="text-2xl font-bold">Toronto</h3>
        <div className="flex w-full justify-between">
          <button className="text-blue-500 text-2xl cursor-pointer">
            <svg
              width="23"
              height="63"
              viewBox="0 0 23 63"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.36602 33C0.830126 32.0718 0.830125 30.9282 1.36602 30L17.4019 2.22501C18.9366 -0.433092 23 0.655697 23 3.725L23 59.275C23 62.3443 18.9366 63.4331 17.4019 60.775L1.36602 33Z"
                fill="#0A85FF"
              />
            </svg>
          </button>
          <div className="flex flex-col bg-white rounded-2xl drop-shadow-xl p-3 gap-[10px] w-[300px] max-w-md mb-8">
            <div className="w-full h-60 overflow-hidden rounded-2xl relative">
              <img
                src="/images/hozier.png"
                alt="Hozier Tour Poster"
                className="w-full h-full object-cover z-0"
              />
              <span className="text-black absolute bottom-0 right-0 p-2 bg-[rgba(255,255,255,0.65)] z-10 rounded-lg">
                0.35 XLM
              </span>
            </div>
            <div>
              <h3 className="text-lg font-normal">Hozier</h3>
              <p className=" text-gray-600 mb-4">Unreal Unearth Tour 2025</p>
              <button className="bg-blue-500 hover:bg-blue-600 w-full text-white px-4 py-2 rounded-full">
                Buy tickets
              </button>
            </div>
          </div>
          <button className="text-blue-500 text-2xl cursor-pointer">
            <svg
              style={{ transform: "rotate(180deg)" }}
              width="23"
              height="63"
              viewBox="0 0 23 63"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.36602 33C0.830126 32.0718 0.830125 30.9282 1.36602 30L17.4019 2.22501C18.9366 -0.433092 23 0.655697 23 3.725L23 59.275C23 62.3443 18.9366 63.4331 17.4019 60.775L1.36602 33Z"
                fill="#0A85FF"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col gap-[15px]">
        <h3 className="text-2xl font-bold">Montreal</h3>
        <div className="flex w-full justify-between">
          <button className="text-blue-500 text-2xl cursor-pointer">
            <svg
              width="23"
              height="63"
              viewBox="0 0 23 63"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.36602 33C0.830126 32.0718 0.830125 30.9282 1.36602 30L17.4019 2.22501C18.9366 -0.433092 23 0.655697 23 3.725L23 59.275C23 62.3443 18.9366 63.4331 17.4019 60.775L1.36602 33Z"
                fill="#0A85FF"
              />
            </svg>
          </button>
          <div className="flex flex-col bg-white rounded-2xl drop-shadow-xl p-3 gap-[10px] w-[300px] max-w-md mb-8">
            <div className="w-full h-60 overflow-hidden rounded-2xl relative">
              <img
                src="/images/laufey.png"
                alt="Hozier Tour Poster"
                className="w-full h-full object-cover z-0"
              />
              <span className="text-black absolute bottom-0 right-0 p-2 bg-[rgba(255,255,255,0.65)] z-10 rounded-lg">
                0.64 XLM
              </span>
            </div>
            <div>
              <h3 className="text-lg font-normal">Laufey</h3>
              <p className=" text-gray-600 mb-4">A Night at the Symphony</p>
              <button className="bg-blue-500 hover:bg-blue-600 w-full text-white px-4 py-2 rounded-full">
                Buy tickets
              </button>
            </div>
          </div>
          <button className="text-blue-500 text-2xl cursor-pointer">
            <svg
              style={{ transform: "rotate(180deg)" }}
              width="23"
              height="63"
              viewBox="0 0 23 63"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.36602 33C0.830126 32.0718 0.830125 30.9282 1.36602 30L17.4019 2.22501C18.9366 -0.433092 23 0.655697 23 3.725L23 59.275C23 62.3443 18.9366 63.4331 17.4019 60.775L1.36602 33Z"
                fill="#0A85FF"
              />
            </svg>
          </button>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
};
export default MyPage;
