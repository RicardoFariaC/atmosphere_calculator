"use client"

import { InfoCard } from "@/app/components/TextCards/InfoCard";
import NavBar from "../../components/NavBar";
import { invoke } from "@tauri-apps/api/core";
import { FormEvent, useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, TooltipProps } from 'recharts';
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { Graph } from "@/app/components/Graph/Graph";
import TableCheckInput from "@/app/components/TableCheckInput/TableCheckInput";
import { densityUnits, distanceUnits, dynamicVUnits, pressureUnits, sosUnits, UnitSystem } from "@/app/utils/units";
import TableTemperatureCheckInput, { decideUnit } from "@/app/components/TableCheckInput/TableTemperatureCheckInput";
import { TemperatureUnit } from "@/app/components/Output/TemperatureOutput";

export interface GraphReturnInterface {
  altitude: number, value: number
}


function CustomTooltip({ payload, label, active }: TooltipProps<string, number>) {
  if (active) {
    return (
      <div className="custom-tooltip p-2 bg-slate-50 bg-opacity-95 text-slate-950 rounded-md">
        <p className="label">{`Altitude: ${label}`}</p>
        <p className="desc">{`Temperature: ${parseFloat(payload?.[0]?.value || "0").toFixed(6) || ""}`}</p>
      </div>
    );
  }

  return null;
}

export default function Home() {
  const [dataTemperature, setDataTemperature] = useState<GraphReturnInterface[]>([]);
  const [dataPressure, setDataPressure] = useState<GraphReturnInterface[]>([]);
  const [dataDensity, setDataDensity] = useState<GraphReturnInterface[]>([]);
  const [dataSoS, setDataSoS] = useState<GraphReturnInterface[]>([]);
  const [dataViscosity, setDataViscosity] = useState<GraphReturnInterface[]>([]);
  
  const [altitudeUnit, setAltitudeUnit] = useState<[string, number]>(["m", 2]);
  const [pressureUnit, setPressureUnit] = useState<[string, number]>(["Pa", 2]);
  const [densityUnit, setDensityUnit] = useState<[string, number]>(["kg/m3", 2]);
  const [speedOfSoundUnit, setSpeedOfSoundUnit] = useState<[string, number]>(["m/s", 2]);
  const [dynamicViscUnit, setDynamicViscUnit] = useState<[string, number]>(["(N.s)/m2", 2]);
  const [temperatureFunction, setTemperatureFunction] = useState<TemperatureUnit>(TemperatureUnit.KELVIN);
  const [temperatureUnit, setTemperatureUnit] = useState<string>("K");

  const handleInputTemperature = async () => {
    await invoke<GraphReturnInterface[]>("compute_graph_temperature")
      .then(res => {
        res.map((v) => {
          v.altitude = v.altitude / altitudeUnit[1];
          v.value = decideUnit(v.value, temperatureFunction);        
          return v;
        })
        setDataTemperature(res);
      })
      .catch(console.error);
  }

  const handleInputPressure = async () => {
    await invoke<GraphReturnInterface[]>("compute_graph_pressure")
    .then(res => {
      res.map((v) => {
        v.altitude = v.altitude / altitudeUnit[1];
        v.value = v.value / pressureUnit[1];        
        return v;
      })
      setDataPressure(res);
    })
    .catch(console.error);
  }

  const handleInputDensity = async () => {
    await invoke<GraphReturnInterface[]>("compute_graph_density")
    .then(res => {
      res.map((v) => {
        v.altitude = v.altitude / altitudeUnit[1];
        v.value = v.value / densityUnit[1];        
        return v;
      })
      setDataDensity(res);
    })
    .catch(console.error);
  }

  const handleInputSoS = async () => {
    await invoke<GraphReturnInterface[]>("compute_graph_sos")
    .then(res => {
      res.map((v) => {
        v.altitude = v.altitude / altitudeUnit[1];
        v.value = v.value / speedOfSoundUnit[1];        
        return v;
      })
      setDataSoS(res);
    })
    .catch(console.error);
  }

  const handleInputViscosity = async () => {
    await invoke<GraphReturnInterface[]>("compute_graph_viscosity")
    .then(res => {
      res.map((v) => {
        v.altitude = v.altitude / altitudeUnit[1];
        v.value = v.value / dynamicViscUnit[1];        
        return v;
      })
      setDataViscosity(res);
    })
    .catch(console.error);
  }

  useEffect(() => {
    handleInputTemperature();
    handleInputPressure();
    handleInputDensity();
    handleInputSoS();
    handleInputViscosity();
  })

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1">
        <NavBar />
        <main className="flex-1 p-6">
        <p className="pb-2">Configure Units</p>
          <div className="mb-8 w-auto p-6 rounded-md bg-slate-100 bg-opacity-20 drop-shadow-lg shadow-lg">
            <InfoCard
              className="mb-5"
              label="Alter units from tables"
            />
            <form className="flex flex-col gap-4 text-lg">
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
                hasCheck={false}
                setUnit={setTemperatureFunction}
                setValue={setTemperatureUnit}
              />
            <TableCheckInput
                unique="pressure"
                label="Pressure"
                unit={pressureUnits}
                unitSystem={UnitSystem.INTERNACIONAL}
                hasCheck={false}
                setValue={setPressureUnit}
            />
            <TableCheckInput
                unique="density"
                label="Density"
                unit={densityUnits}
                unitSystem={UnitSystem.INTERNACIONAL}
                hasCheck={false}
                setValue={setDensityUnit}
            />
            <TableCheckInput
                unique="speedofsound"
                label="Speed of Sound"
                unit={sosUnits}
                unitSystem={UnitSystem.INTERNACIONAL}
                hasCheck={false}
                setValue={setSpeedOfSoundUnit}
            />
            <TableCheckInput
                unique="viscosity"
                label="Viscosity"
                unit={dynamicVUnits}
                unitSystem={UnitSystem.INTERNACIONAL}
                hasCheck={false}
                setValue={setDynamicViscUnit}
            />
            </form>
          </div>
          <div className="w-auto bg-slate-100 rounded-md px-2 gap-4 flex flex-wrap">
            <Graph
                data={dataTemperature}
                lineData="value"
                xData="value"
                yData="altitude"
                xLabel={`Temperature [${temperatureUnit}]`}
                yLabel={`Altitude [${altitudeUnit[0]}]`}
                CustomTooltip={CustomTooltip}
              />
              <Graph
                data={dataPressure}
                lineData="value"
                xData="value"
                yData="altitude"
                xLabel={`Pressure [${pressureUnit[0]}]`}
                yLabel={`Altitude [${altitudeUnit[0]}]`}
                CustomTooltip={CustomTooltip}
              />
              <Graph
                data={dataDensity}
                lineData="value"
                xData="value"
                yData="altitude"
                xLabel={`Density [${densityUnit[0]}]`}
                yLabel={`Altitude [${altitudeUnit[0]}]`}
                CustomTooltip={CustomTooltip}
              />
              <Graph
                data={dataSoS}
                lineData="value"
                xData="value"
                yData="altitude"
                xLabel={`Speed of Sound [${speedOfSoundUnit[0]}]`}
                yLabel={`Altitude [${altitudeUnit[0]}]`}
                CustomTooltip={CustomTooltip}
              />
              <Graph
                data={dataViscosity}
                lineData="value"
                xData="value"
                yData="altitude"
                xLabel={`Viscosity [${dynamicViscUnit[0]}]`}
                yLabel={`Altitude [${altitudeUnit[0]}]`}
                CustomTooltip={CustomTooltip}
              />
          </div>
        </main>
      </div>
    </div>
  );
}
