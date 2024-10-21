"use client"

import NavBar from "../../components/NavBar";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <NavBar />
        <main className="flex-1 p-6">
          <div className="w-auto p-6 rounded-md bg-slate-100 bg-opacity-20 drop-shadow-lg shadow-lg">
            <div className="mb-5">
              <h1 className="text-3xl pb-1">Disclaimer</h1>
              <hr className="py-1"/>
              <p className="pl-5">
                I cannot guarantee accuracy over all calculations. This software was made by educational purposes and can contain bugs and errors.
                This software was made up with Tauri.rs and NextJS, all calculations were processed by Rust and all unit change was made in JavaScript.
              </p>
            </div>
            <div className="mb-0">
              <h1 className="text-3xl pb-1">References</h1>
              <hr className="py-1"/>
              <p className="pl-5">
                U.S. Standard Atmosphere 1976 by NASA (NASA-TM-X-74335). This is the official document describing the 1976 standard atmosphere.
              </p>
            </div>
          </div>
        </main>
      </div >
    </div>
  );
}
