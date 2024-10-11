"use client"

import { InfoCard } from "@/app/components/TextCards/InfoCard";
import NavBar from "../../components/NavBar";
import TableCheckInput from "@/app/components/TableCheckInput/TableCheckInput";
import { densityUnits, distanceUnits, dynamicVUnits, pressureUnits, sosUnits, UnitSystem } from "@/app/utils/units";
import { FormEvent, use, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import TableTemperatureCheckInput, { decideUnit } from "@/app/components/TableCheckInput/TableTemperatureCheckInput";
import { TemperatureUnit } from "@/app/components/Output/TemperatureOutput";

interface ReturnInterface {
  [key: string]: [number?];
}

export default function Table() {
  const [altitudeUnit, setAltitudeUnit] = useState<[string, number]>(["m", 2]);
  const [isComputed, setIsComputed] = useState<boolean>(false);
  const [temperatureUnit, setTemperatureUnit] = useState<string>("K");
  const [pressureUnit, setPressureUnit] = useState<[string, number]>(["Pa", 2]);
  const [densityUnit, setDensityUnit] = useState<[string, number]>(["kg/m3", 2]);
  const [speedOfSoundUnit, setSpeedOfSoundUnit] = useState<[string, number]>(["m/s", 2]);
  const [dynamicViscUnit, setDynamicViscUnit] = useState<[string, number]>(["(N.s)/m2", 2]);
  const [minValue, setMinValue] = useState<string>("0");
  const [maxValue, setMaxValue] = useState<string>("5000");
  const [stepValue, setStepValue] = useState<number>(1000);
  const [table, setTable] = useState<ReturnInterface>({
    altitude: [],
  });

  const [temperatureFunction, setTemperatureFunction] = useState<TemperatureUnit>(TemperatureUnit.KELVIN);
  const [temperatureCheck, setTemperatureCheck] = useState<boolean>(true);
  const [pressureCheck, setPressureCheck] = useState<boolean>(true);
  const [densityCheck, setDensityCheck] = useState<boolean>(true);
  const [sOSCheck, setSOSCheck] = useState<boolean>(true);
  const [dynamicVCheck, setDynamicVCheck] = useState<boolean>(true);

  const handleInput = async (e: FormEvent) => {
    e.preventDefault();
    setIsComputed(true);
    await invoke<ReturnInterface>("compute_table", { 
      minAltitude: parseInt(minValue), 
      maxAltitude: parseInt(maxValue), 
      step: stepValue,
    })
      .then(res => {
        setTable(res);
      })
      .catch(console.error);
  }

  useEffect(() => {
    console.log(pressureCheck);
  })

  useEffect(() => {
    if(isComputed) {
      setTable({
        altitude: [],
      })
    }
  }, [altitudeUnit])

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <NavBar />
        <main className="flex-1 p-6">
          <p className="pb-2">Configure Parameters</p>
          <div className="mb-8 w-auto p-6 rounded-md bg-slate-100 bg-opacity-20 drop-shadow-lg shadow-lg">
            <InfoCard
              className="mb-5"
              label="Alter parameters that will show in table"
              />
            <form className="flex flex-col gap-4 text-lg ">
              <TableCheckInput
                unique="altitude"
                label="Altitude"
                unit={distanceUnits}
                unitSystem={UnitSystem.INTERNACIONAL}
                hasCheck={false}
                setValue={setAltitudeUnit}
              />
              <TableTemperatureCheckInput
                unique="temperature"
                label="Temperature"
                setUnit={setTemperatureFunction}
                setCheck={setTemperatureCheck}
                setValue={setTemperatureUnit}
              />
              <TableCheckInput
                unique="pressure"
                label="Pressure"
                unit={pressureUnits}
                unitSystem={UnitSystem.INTERNACIONAL}
                setValue={setPressureUnit}
                setCheck={setPressureCheck}
              />
              <TableCheckInput
                unique="density"
                label="Density"
                unit={densityUnits}
                unitSystem={UnitSystem.INTERNACIONAL}
                setValue={setDensityUnit}
                setCheck={setDensityCheck}
              />
              <TableCheckInput
                unique="speedofsound"
                label="Speed of Sound"
                unit={sosUnits}
                unitSystem={UnitSystem.INTERNACIONAL}
                setValue={setSpeedOfSoundUnit}
                setCheck={setSOSCheck}
              />
              <TableCheckInput 
                unique="dynamicv"
                label="Dynamic Viscosity"
                unit={dynamicVUnits}
                unitSystem={UnitSystem.INTERNACIONAL}
                setValue={setDynamicViscUnit}
                setCheck={setDynamicVCheck}
              />
            </form>
          </div>
          <p className="pb-2">Configure Range</p>
          <div className="mb-8 w-auto p-6 rounded-md bg-slate-100 bg-opacity-20 drop-shadow-lg shadow-lg">
            <InfoCard
              className="mb-5"
              label="Alter altitude range that will show in table"
              />
            <form className="flex flex-col gap-4 text-lg ">
              <div className="flex items-center gap-4 flex-1">
                <label className="basis-1/2" htmlFor="altitude-min">Minimum Value</label>
                <input
                  id="altitude-min"
                  className="bg-zinc-800 p-2 rounded-md basis-1/2"
                  value={minValue}
                  onChange={e => setMinValue(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4 flex-1">
                <label className="basis-1/2" htmlFor="altitude-min">Maximum Value</label>
                <input
                  id="altitude-max"
                  className="bg-zinc-800 p-2 rounded-md basis-1/2"
                  value={maxValue}
                  onChange={e => { setMaxValue(e.target.value) }}
                />
              </div>
              <div className="flex items-center gap-4 flex-1">
                <label className="basis-1/2" htmlFor="altitude-min">Step Value</label>
                <input
                  id="altitude-step"
                  className="bg-zinc-800 p-2 rounded-md basis-1/2"
                  value={stepValue}
                  onChange={e => {
                    setStepValue(parseInt(e.target.value));
                  }}
                />
              </div>
              <div className="flex items-center justify-end gap-4 h-12">
                <button 
                  onClick={handleInput}
                  className="px-4 py-1 bg-zinc-600 drop-shadow-md shadow-md rounded-md focus:outline hover:bg-zinc-900 hover:opacity-80"
                >Compute</button>
                <button className="px-4 py-1 bg-zinc-600 drop-shadow-md shadow-md rounded-md focus:outline hover:bg-zinc-900 hover:opacity-80">Clear</button>
              </div>
            </form>
          </div>
          <div>
            <table 
            className="w-full table-fixed border-collapse bg-gray-50 border border-slate-400">
              <thead className="w-full text-black font-bold py-1 px-2">
                <tr>
                  <th className="text-left font-black p-2 text-lg border border-slate-400 bg-zinc-300">Altitude [{altitudeUnit[0]}]</th>
                  {temperatureCheck && <th className="text-left font-black p-2 text-lg border border-slate-400 bg-zinc-300">Temperature [{temperatureUnit}]</th>}
                  {pressureCheck && <th className="text-left font-black p-2 text-lg border border-slate-400 bg-zinc-300">Pressure [{pressureUnit[0]}]</th>}
                  {densityCheck && <th className="text-left font-black p-2 text-lg border border-slate-400 bg-zinc-300">Density [{densityUnit[0]}]</th>}
                  {sOSCheck && <th className="text-left font-black p-2 text-lg border border-slate-400 bg-zinc-300">SOS [{speedOfSoundUnit[0]}]</th>}
                  {dynamicVCheck && <th className="text-left font-black p-2 text-lg border border-slate-400 bg-zinc-300">Dynamic Visc. [{dynamicViscUnit[0]}]</th>}
                </tr>
              </thead>
              <tbody className="[&>tr:nth-child(odd)]:bg-zinc-200 [&>tr:nth-child(even)]:bg-zinc-100">
                {table!["altitude"].map((prop, i) => {
                  return (
                   <tr className="text-black" key={i}>
                    <td className="p-2 text-gray-800 border border-slate-400">{(prop!).toFixed(5)}</td>
                    {temperatureCheck && <td className="p-2 text-gray-800 border border-slate-400">{decideUnit(table!["temperature"][i]!, temperatureFunction)}</td>}
                    {pressureCheck && <td className="p-2 text-gray-800 border border-slate-400">{(table!["pressure"][i]! / pressureUnit[1])}</td>}
                    {densityCheck && <td className="p-2 text-gray-800 border border-slate-400">{(table!["density"][i]! / densityUnit[1]).toFixed(5)}</td>}
                    {sOSCheck && <td className="p-2 text-gray-800 border border-slate-400">{(table!["speed_of_sound"][i]! / speedOfSoundUnit[1]).toFixed(5)}</td>}
                    {dynamicVCheck && <td className="p-2 text-gray-800 border border-slate-400">{(table!["dynamic_v"][i]! / dynamicViscUnit[1]).toFixed(10)}</td>}
                   </tr> 
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
