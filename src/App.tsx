/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Truck, Ruler, Weight, ArrowRight, ArrowLeft, RefreshCw, Info, ChevronRight, ShoppingCart, MapPin, Calculator } from 'lucide-react';
import { Product, OptimizationResult, ShipmentConfig } from './types';
import { ProductIterator } from './lib/iterator';
import { ShipmentAggregator } from './lib/aggregator';

// Default products from the catalog
const CATALOG: Product[] = [
  { id: '1', name: 'Sofá KLIPPAN', weight: 28, dimensions: '180×85×66cm', volume: 1.0098 },
  { id: '2', name: 'Estantería BILLY', weight: 15, dimensions: '80×28×202cm', volume: 0.4525 },
  { id: '3', name: 'Alfombra TIPHEDE', weight: 2, dimensions: '120×180×1cm', volume: 0.0216 },
  { id: '4', name: 'Mesa MALM', weight: 12, dimensions: '140×60×75cm', volume: 0.63 },
  { id: '5', name: 'Silla UTÅKER', weight: 5.5, dimensions: '48×50×80cm', volume: 0.192 },
  { id: '6', name: 'Lámpara FLEKKE', weight: 1.2, dimensions: '30×30×150cm', volume: 0.135 },
];

const CONFIG: Omit<ShipmentConfig, 'distance' | 'shippingMethod'> = {
  baseCost: 20,
  maxWeightPerPackage: 30,
  maxVolumePerPackage: 1.5,
  extraKmRate: 0.75,
  baseDistance: 50,
  extraKgRate: 1.5,
  fastShippingSurcharge: 15,
};

export default function App() {
  const [distance, setDistance] = useState(60);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(['1', '2', '3']);
  const [shippingMethod, setShippingMethod] = useState<'normal' | 'fast'>('normal');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Derived products list based on selection
  const products = useMemo(() => CATALOG.filter(p => selectedProductIds.includes(p.id)), [selectedProductIds]);

  // Iterator for current products
  const iterator = useMemo(() => new ProductIterator(products), [products]);

  const handleOptimize = () => {
    setIsOptimizing(true);
    // Simulate some "computation"
    setTimeout(() => {
      const config: ShipmentConfig = { 
        ...CONFIG, 
        distance, 
        shippingMethod 
      };
      const aggregator = new ShipmentAggregator(iterator, config);
      const optimizationResult = aggregator.optimize();
      setResult(optimizationResult);
      setIsOptimizing(false);
    }, 800);
  };

  const toggleProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Initial optimization
  useEffect(() => {
    handleOptimize();
  }, [selectedProductIds, shippingMethod]); // Re-run when inputs change

  return (
    <div className="min-h-screen bg-bg-warm font-sans text-text-dark pb-32 lg:pb-20">
      {/* LOGULIA Branding Header */}
      <header className="bg-logulia-blue text-white py-4 lg:py-5 px-6 lg:px-10 shadow-md sticky top-0 z-50 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="bg-logulia-yellow text-logulia-blue px-3 lg:px-4 py-1 lg:py-1.5 font-black text-xl lg:text-2xl rounded-full tracking-tighter shadow-sm">
            LOGULIA
          </div>
          <h1 className="text-sm lg:text-lg font-light tracking-tight uppercase border-l border-white/20 pl-3 lg:pl-4 hidden sm:block">
            Logistics | <span className="font-bold">Optimizer System</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 text-[10px] lg:text-[12px] font-medium opacity-80 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
          v2.4.0 Engine Active
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 lg:px-6 mt-4 lg:mt-6 grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] gap-6 items-start overflow-hidden">
        
        {/* Paso 1: Iterator Component (Left Column) */}
        <section className={`bg-card-bg rounded-xl border border-border-warm shadow-sm flex flex-col transition-all duration-300 ${currentStep === 1 ? 'block' : 'hidden lg:flex'} lg:h-[calc(100vh-140px)] lg:sticky lg:top-[100px]`}>
          <div className="p-4 border-b border-border-warm bg-[#fafafa]">
            <h2 className="font-bold text-text-muted uppercase tracking-wider text-[12px] flex items-center gap-2">
              <ShoppingCart size={14} className="text-logulia-blue" />
              Paso 1: Iterator de Productos
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] lg:min-h-0">
            {CATALOG.map((p, idx) => {
              const isSelected = selectedProductIds.includes(p.id);
              return (
                <motion.div 
                  key={p.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => toggleProduct(p.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all group cursor-pointer ${isSelected ? 'bg-white border-logulia-blue/50 shadow-sm' : 'bg-gray-50/50 border-transparent opacity-60 grayscale'}`}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm truncate ${isSelected ? 'text-text-dark' : 'text-text-muted'}`}>{p.name}</h3>
                    <p className="text-[11px] text-text-muted">{p.weight}kg | {p.dimensions}</p>
                  </div>
                  {isSelected && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter"
                    >
                      Selected
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="p-4 bg-[#fafafa] border-t border-border-warm flex justify-between items-center lg:hidden">
             <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Catálogo Disponible</span>
             <span className="text-[11px] font-black text-logulia-blue">{selectedProductIds.length} / {CATALOG.length}</span>
          </div>
        </section>

        {/* Paso 2: Aggregator Component (Middle Column) */}
        <section className={`bg-card-bg rounded-xl border border-border-warm shadow-sm flex flex-col transition-all duration-300 ${currentStep === 2 ? 'block' : 'hidden lg:flex'} min-h-[calc(100vh-140px)]`}>
          <div className="p-4 border-b border-border-warm bg-[#fafafa]">
            <h2 className="font-bold text-text-muted uppercase tracking-wider text-[12px] flex items-center gap-2">
              <Truck size={14} className="text-logulia-blue" />
              Paso 2: Aggregator de Envíos
            </h2>
          </div>

          <div className="flex-1 p-4 lg:p-6 overflow-y-auto min-h-[400px]">
            <AnimatePresence mode="wait">
              {isOptimizing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="w-12 h-12 border-2 border-logulia-blue/10 border-t-logulia-blue rounded-full"
                  />
                  <div>
                    <p className="font-bold text-sm text-text-dark">Heurística Greedy en marcha...</p>
                    <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest">Calculando optimización</p>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5"
                >
                  {result.packages.map((pkg, pIdx) => (
                    <motion.div 
                      key={pIdx}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: pIdx * 0.1 }}
                      className={`border-2 rounded-xl p-4 bg-[#fdfdfd] flex flex-col relative transition-colors ${pkg.totalWeight <= 28 ? 'border-[#4CAF50]/30 bg-[#f8fff8]' : 'border-dashed border-border-warm'}`}
                    >
                      <div className="font-bold text-[13px] mb-4 flex justify-between items-center uppercase tracking-tight">
                        <span>Envío #{String(pIdx + 1).padStart(2, '0')}</span>
                        {pkg.totalWeight <= 28 && (
                          <span className="bg-[#e8f5e9] text-[#2e7d32] text-[10px] px-2 py-0.5 rounded font-black uppercase">Óptimo</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2 mb-4">
                        {pkg.products.map((prod, prIdx) => (
                          <div key={prIdx} className="flex justify-between text-[12px] py-1 border-b border-gray-100 last:border-0">
                            <span className="text-text-dark font-medium">{prod.name}</span>
                            <span className="text-text-muted opacity-70">{prod.weight}kg</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-border-warm font-bold text-right text-logulia-blue text-[14px]">
                        {pkg.cost.toFixed(2)}€
                      </div>
                    </motion.div>
                  ))}
                  <motion.div className="border-2 border-dotted border-border-warm rounded-xl p-8 flex flex-col items-center justify-center opacity-30 hover:opacity-50 transition-opacity cursor-wait hidden md:flex">
                    <span className="text-[12px] font-medium">+ Nuevo Contenedor</span>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </section>

        {/* Paso 3 & 4: Control & Optimization (Right Column) */}
        <section className={`bg-card-bg rounded-xl border border-border-warm shadow-sm flex flex-col transition-all duration-300 ${currentStep === 3 ? 'block' : 'hidden lg:flex'} lg:h-[calc(100vh-140px)] lg:sticky lg:top-[100px]`}>
          <div className="p-4 border-b border-border-warm bg-[#fafafa]">
            <h2 className="font-bold text-text-muted uppercase tracking-wider text-[12px] flex items-center gap-2">
              <Calculator size={14} className="text-logulia-blue" />
              Paso 3 & 4: Control y Costes
            </h2>
          </div>

          <div className="flex-1 p-6 space-y-6 lg:space-y-8 overflow-y-auto">
            {/* Shipping Mode */}
            <div className="space-y-3">
              <div className="flex justify-between text-[12px]">
                <span className="text-text-muted font-medium uppercase tracking-tighter">Tipo de Envío</span>
                <span className="font-black text-logulia-blue uppercase text-[10px]">{shippingMethod === 'fast' ? 'Rápido (+15€)' : 'Normal'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setShippingMethod('normal')}
                  className={`py-2 px-3 rounded-lg text-[10px] font-black border transition-all ${shippingMethod === 'normal' ? 'bg-logulia-blue text-white border-logulia-blue shadow-sm' : 'bg-white text-text-muted border-border-warm'}`}
                >
                  NORMAL
                </button>
                <button 
                  onClick={() => setShippingMethod('fast')}
                  className={`py-2 px-3 rounded-lg text-[10px] font-black border transition-all ${shippingMethod === 'fast' ? 'bg-logulia-blue text-white border-logulia-blue shadow-sm' : 'bg-white text-text-muted border-border-warm'}`}
                >
                  RÁPIDO
                </button>
              </div>
            </div>

            {/* Distance Control */}
            <div className="space-y-3">
              <div className="flex justify-between text-[12px]">
                <span className="text-text-muted font-medium uppercase tracking-tighter">Distancia de Entrega</span>
                <span className="font-black text-logulia-blue">{distance} km</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="200" 
                value={distance} 
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-logulia-blue"
              />
              <div className="h-2 bg-[#eee] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${distance > 100 ? 'bg-[#f44336]' : 'bg-logulia-blue'}`} 
                  style={{ width: `${Math.min(100, (distance / 200) * 100)}%` }}
                />
              </div>
              {distance > 50 && (
                <span className="text-[10px] font-bold text-[#f44336] uppercase tracking-tighter flex items-center gap-1">
                  <Info size={10} /> +{distance - 50}km exceso (+{((distance - 50) * 0.75).toFixed(2)}€)
                </span>
              )}
            </div>

            {/* Weight Metric (Average/Max Sample) */}
            <div className="space-y-3">
              <span className="text-text-muted font-medium text-[12px] uppercase tracking-tighter">Límite de Peso (Máx 30kg)</span>
              <div className="text-[18px] font-bold">
                {result ? (result.packages[0]?.totalWeight.toFixed(1) || '0.0') : '0.0'} kg
              </div>
              <div className="h-1.5 bg-[#eee] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-logulia-blue transition-all duration-500" 
                  style={{ width: result ? `${(result.packages[0]?.totalWeight / 30) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#f9f9f9] border-t border-border-warm flex flex-col gap-4">
            <div>
              <span className="text-text-muted font-medium text-[11px] uppercase tracking-widest block mb-1">COSTE TOTAL OPTIMIZADO</span>
              <div className="text-2xl lg:text-3xl font-black text-text-dark tracking-tighter">
                {result ? result.totalCost.toFixed(2) : '0.00'}€
              </div>
            </div>
            
            <button 
              onClick={() => handleOptimize()}
              disabled={isOptimizing}
              className="bg-logulia-blue text-white font-bold py-3 px-4 rounded-lg uppercase text-[12px] hover:bg-logulia-blue/90 transition-all flex items-center justify-center gap-2"
            >
              {isOptimizing ? <RefreshCw className="animate-spin" size={16} /> : <ShoppingCart size={16} />}
              Generar Envíos
            </button>
          </div>
        </section>

      </main>

      {/* Mobile Step Navigator (Wizard Bar) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-warm p-4 flex items-center justify-between lg:hidden z-[60] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className={`p-3 rounded-full border border-border-warm transition-all ${currentStep === 1 ? 'opacity-20' : 'active:scale-95 bg-[#fafafa]'}`}
        >
          <ArrowLeft size={20} className="text-text-muted" />
        </button>
        
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">LOGULIA LOGISTICS V2.4.0</span>
            <div className="flex gap-1.5 items-center">
                {[1, 2, 3].map(s => (
                    <div 
                        key={s} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${currentStep === s ? 'w-8 bg-logulia-blue' : 'w-2 bg-border-warm'}`}
                    />
                ))}
            </div>
            <span className="text-[11px] font-black text-text-dark mt-2 tracking-widest uppercase">
                {currentStep} de 3
            </span>
        </div>

        <button 
          onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
          disabled={currentStep === 3}
          className={`p-3 rounded-full border border-border-warm transition-all ${currentStep === 3 ? 'opacity-20' : 'active:scale-95 bg-[#fafafa]'}`}
        >
          <ArrowRight size={20} className="text-text-muted" />
        </button>
      </div>

      {/* Floating Action Button for Reset (Desktop Only) */}
      <div className="fixed bottom-8 right-8 hidden lg:block">
        <button 
          onClick={() => {
            setDistance(60);
            setResult(null);
            setTimeout(() => handleOptimize(), 100);
          }}
          className="bg-logulia-blue text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group"
          title="Reiniciar Simulación"
        >
          <RefreshCw size={24} />
        </button>
      </div>
    </div>
  );
}
