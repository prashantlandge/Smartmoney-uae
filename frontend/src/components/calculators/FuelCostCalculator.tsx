import { useState, useMemo } from 'react';
import { Fuel, Car, TrendingDown } from 'lucide-react';

export default function FuelCostCalculator() {
  const [dailyKm, setDailyKm] = useState(40);
  const [mileage, setMileage] = useState(12);
  const [fuelPrice, setFuelPrice] = useState(3.03);

  const result = useMemo(() => {
    const dailyLitres = dailyKm / mileage;
    const dailyCost = dailyLitres * fuelPrice;
    const monthlyCost = dailyCost * 30;
    const annualCost = dailyCost * 365;
    return { dailyCost, monthlyCost, annualCost, dailyLitres };
  }, [dailyKm, mileage, fuelPrice]);

  const fmt = (n: number) => `AED ${n.toLocaleString('en-AE', { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white rounded-card border border-surface-200 overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-500 flex items-center gap-2 text-white">
        <Fuel size={16} />
        <h3 className="text-sm font-bold">Fuel Cost Calculator</h3>
      </div>

      <div className="p-5 grid sm:grid-cols-[1fr_1fr] gap-5">
        <div className="space-y-4">
          <div>
            <label className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Daily Distance (km)</span>
              <span className="font-semibold text-gray-900">{dailyKm} km</span>
            </label>
            <input type="range" min={5} max={200} step={5} value={dailyKm}
              onChange={(e) => setDailyKm(Number(e.target.value))}
              className="w-full accent-amber-600" />
            <div className="flex justify-between text-label text-gray-400">
              <span>5 km</span><span>200 km</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Mileage (km/litre)</span>
              <span className="font-semibold text-gray-900">{mileage} km/L</span>
            </label>
            <input type="range" min={5} max={25} step={0.5} value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              className="w-full accent-amber-600" />
            <div className="flex justify-between text-label text-gray-400">
              <span>5 km/L</span><span>25 km/L</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Fuel Price (AED/litre)</span>
              <span className="font-semibold text-gray-900">AED {fuelPrice.toFixed(2)}</span>
            </label>
            <input type="range" min={2} max={5} step={0.01} value={fuelPrice}
              onChange={(e) => setFuelPrice(Number(e.target.value))}
              className="w-full accent-amber-600" />
            <div className="flex justify-between text-label text-gray-400">
              <span>AED 2.00</span><span>AED 5.00</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
            <p className="text-xs text-amber-600 font-medium mb-1">Monthly Fuel Cost</p>
            <p className="text-display-lg font-bold text-amber-700">{fmt(result.monthlyCost)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-50 rounded-xl p-3 text-center">
              <Car size={14} className="mx-auto text-gray-400 mb-1" />
              <p className="text-label text-gray-500">Daily Cost</p>
              <p className="text-sm font-bold text-gray-900">{fmt(result.dailyCost)}</p>
            </div>
            <div className="bg-surface-50 rounded-xl p-3 text-center">
              <TrendingDown size={14} className="mx-auto text-gray-400 mb-1" />
              <p className="text-label text-gray-500">Annual Cost</p>
              <p className="text-sm font-bold text-amber-600">{fmt(result.annualCost)}</p>
            </div>
          </div>
          <p className="text-label text-gray-400 text-center">
            Based on UAE fuel prices as of April 2026. Prices change monthly.
          </p>
        </div>
      </div>
    </div>
  );
}
