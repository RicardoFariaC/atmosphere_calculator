"use client"

import { invoke } from "@tauri-apps/api/tauri"
import { Calculator, FileQuestion, LineChart, Table } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Output } from "./components/Output"

interface ComputeReturn {
  [key: string]: number;
}

export default function Home() {
  const [altitude, setAltitude] = useState<string>("");
  const [altitudeUnit, setAltitudeUnit] = useState<number>(1);

  const [atmosphere, setAtmosphere] = useState<ComputeReturn>({});
  const [pressure, setPressure] = useState<number>(0);

  useEffect(() => {
    setPressure(atmosphere["pressure"]);
  }, [atmosphere, pressure]);

  const handleInput = async (e: FormEvent) => {
    e.preventDefault()
    await invoke<ComputeReturn>("compute", { altitude: parseFloat(altitude), altitudeUnit: altitudeUnit })
      .then(res => {
        return setAtmosphere(res)
      })
      .catch(console.error);
  };
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <aside className="w-auto">
          <nav className="bg-zinc-900 space-y-2 sticky top-3 p-6 m-3 rounded-md">
            <a href="" className="flex items-center gap-2 hover:bg-slate-300 hover:bg-opacity-20 py-4 px-2 rounded-md">
              <Calculator />
              Calculator
            </a>
            <a href="" className="flex items-center gap-2 hover:bg-slate-300 hover:bg-opacity-20 py-4 px-2 rounded-md">
              <Table />
              Table
            </a>
            <a href="" className="flex items-center gap-2 hover:bg-slate-300 hover:bg-opacity-20 py-4 px-2 rounded-md">
              <LineChart />
              Graphs
            </a>
            <a href="" className="flex items-center gap-2 hover:bg-slate-300 hover:bg-opacity-20 py-4 px-2 rounded-md">
              <FileQuestion />
              Help
            </a>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <p className="pb-2">Input</p>
          <div className="w-auto p-6 rounded-md bg-slate-100 bg-opacity-20 drop-shadow-lg shadow-lg">
            <form className="flex flex-col gap-4 text-lg">
              <div className="flex items-center gap-4 flex-1">
                <label htmlFor="unit" className="basis-1/2">Unit System</label>
                <select name="" id="" disabled={true} className="bg-zinc-800 p-2 rounded-md w-64 basis-1/2">
                  <option value="is">International System</option>
                </select>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <label htmlFor="altitude" className="basis-1/2">Altitude</label>
                <input
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  id="altitude"
                  className="bg-zinc-800 p-2 rounded-md basis-1/4"
                  />
                <select className="bg-zinc-800 p-2 rounded-md w-64 basis-1/4" value={altitudeUnit} onChange={(e) => setAltitudeUnit(parseFloat(e.target.value))}>
                  <option value="1">meters[m]</option>
                  <option value="1000">kilometers[km]</option>
                  <option value="0.3048">feet[ft]</option>
                </select>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <label htmlFor="velocity" className="basis-1/2">Velocity</label>
                <input 
                  type="number" 
                  id="velocity" 
                  className="bg-zinc-800 p-2 rounded-md basis-1/4"
                  />
                <select className="bg-zinc-800 p-2 rounded-md w-64 basis-1/4">
                  <option value="1">meters/second[m/s]</option>
                  <option value="0.2777778">kilometers/hour[km/h]</option>
                  <option value="0.3048">feet/second[ft/s]</option>
                </select>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <label htmlFor="refLength" className="basis-1/2">Reference Length</label>
                <input 
                  type="number" 
                  id="refLength" 
                  className="bg-zinc-800 p-2 rounded-md basis-1/4"
                  />
                <select className="bg-zinc-800 p-2 rounded-md w-64 basis-1/4">
                  <option value="1">meters[m]</option>
                  <option value="1000">kilometers[km]</option>
                  <option value="0.3048">feet[ft]</option>
                </select>
              </div>
              <div className="flex items-center gap-4 flex-1">
                <label htmlFor="temperature" className="basis-1/2">Temperature offset</label>
                <input 
                  type="number" 
                  id="temperature"
                  className="bg-zinc-800 p-2 rounded-md basis-1/4" 
                />
                <select className="bg-zinc-800 p-2 rounded-md w-64 basis-1/4" >
                  <option value="1">Celsius[°C] / Kelvin[K]</option>
                  <option value="0.5556">Fahrenheit[°F] / Rankine[°R]</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-4 h-12">
                <button 
                  className="px-4 py-1 bg-zinc-600 drop-shadow-md shadow-md rounded-md focus:outline"
                  onClick={handleInput}
                >Compute</button>
                <button className="px-4 py-1 bg-zinc-600 drop-shadow-md shadow-md rounded-md focus:outline">Clear</button>
              </div>
            </form>
          </div>
          <p className="pt-4 pb-2">Output</p>
          <div className="w-auto p-6 rounded-md bg-slate-100 bg-opacity-20 drop-shadow-lg shadow-lg">
            <form className="flex flex-col gap-4 text-lg">
              <Output
                label="pressure"
                value={atmosphere["pressure"]}
              />
              <Output
                label="Speed of Sound"
                value={atmosphere["speed_of_sound"]}
              />
              <Output
                label="Density"
                value={atmosphere["density"]}
              />
              <Output
                label="Temperature"
                value={atmosphere["temperature"]}
              />
              <Output
                label="Viscosities"
                value={atmosphere["viscosities"]}
              />
            </form>
          </div>
        </main>
      </div >
    </div>
  );
}
