"use client"

import { invoke } from "@tauri-apps/api/tauri"
import { FormEvent, useEffect, useState } from "react";
import { AltitudeForm } from "./components/Form/AltitudeForm";
import { InfoCard } from "./components/TextCards/InfoCard";
import { UnitSystem } from "./utils/units";
import { VelocityForm } from "./components/Form/VelocityForm";
import NavBar from "./components/NavBar";

interface ComputeReturn {
  [key: string]: number;
}

export default function Home() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(UnitSystem.INTERNACIONAL);
  const [altitude, setAltitude] = useState<string>("");
  const [altitudeUnit, setAltitudeUnit] = useState<number>(1);
  const [velocity, setVelocity] = useState<string>("");
  const [velocityUnit, setVelocityUnit] = useState<number>(1);
  const [atmosphere, setAtmosphere] = useState<ComputeReturn>({});

  const handleInput = async (e: FormEvent) => {
    e.preventDefault()
    await invoke<ComputeReturn>("compute", { altitude: parseFloat(altitude) * altitudeUnit || 0, velocity: parseFloat(velocity) * velocityUnit || 0 })
      .then(res => {
        return setAtmosphere(res)
      })
      .catch(console.error);
  };
  
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <NavBar />
        <main className="flex-1 p-6">
          <p className="pb-2">Input</p>
          <div className="w-auto p-6 rounded-md bg-slate-100 bg-opacity-20 drop-shadow-lg shadow-lg">
            <form className="flex flex-col gap-4 text-lg">
              <div className="flex items-center gap-4 flex-1">
                <label htmlFor="unit" className="basis-1/4">Unit System</label>
                <select 
                  name="" id="" disabled={false} className="bg-zinc-800 p-2 rounded-md w-64 basis-full"
                  onChange={
                    (e) => setUnitSystem(parseInt(e.target.value))
                  }
                  value={unitSystem}
                >
                  <option value={1}>International System</option>
                  <option value={2}>Imperial System</option>
                </select>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <label htmlFor="altitude" className="basis-1/2">Geometric Altitude</label>
                <input
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  id="altitude"
                  className="bg-zinc-800 p-2 rounded-md basis-1/2"
                  type="number"
                />
                <select className="bg-zinc-800 p-2 rounded-md w-64 basis-1/4" value={altitudeUnit} onChange={(e) => setAltitudeUnit(parseFloat(e.target.value))}>
                  <option value="1000">kilometers[km]</option>
                  <option value="1">meters[m]</option>
                  <option value="0.3048">feet[ft]</option>
                </select>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <label htmlFor="velocity" className="basis-1/2">Velocity</label>
                <input 
                  value={velocity}
                  onChange={(e) => setVelocity(String(parseFloat(e.target.value) * velocityUnit))}
                  id="velocity" 
                  className="bg-zinc-800 p-2 rounded-md basis-1/2"
                  type="number"
                  />
                <select 
                  value={velocityUnit}
                  className="bg-zinc-800 p-2 rounded-md w-64 basis-1/4"
                  onChange={e => setVelocityUnit(parseFloat(e.target.value))}
                >
                  <option value="0.2777778">kilometers/hour[km/h]</option>
                  <option value="1">meters/second[m/s]</option>
                  <option value="0.3048">feet/second[ft/s]</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-4 h-12">
                <button 
                  className="px-4 py-1 bg-zinc-600 drop-shadow-md shadow-md rounded-md focus:outline hover:bg-zinc-900 hover:opacity-80"
                  onClick={handleInput}
                >Compute</button>
                <button className="px-4 py-1 bg-zinc-600 drop-shadow-md shadow-md rounded-md focus:outline hover:bg-zinc-900 hover:opacity-80">Clear</button>
              </div>
            </form>
          </div>
          <p className="pt-4 pb-2">Output</p>
          <div className="w-auto p-6 rounded-md bg-slate-100 bg-opacity-20 drop-shadow-lg shadow-lg">
            <InfoCard
              className="mb-5"
              label="Outputs from altitude only"
            />
            <AltitudeForm 
              atmosphere={atmosphere}
              unitSystem={unitSystem}
            />
            <InfoCard 
              className="my-5"
              label="Outputs from altitude and velocity"
            />
            <VelocityForm
              atmosphere={atmosphere}
              unitSystem={unitSystem}
            />
          </div>
        </main>
      </div >
    </div>
  );
}
