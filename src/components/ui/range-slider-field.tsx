'use client';

import React, { useEffect, useState } from 'react';

import { Slider } from '@/components/ui/slider';

interface RangeSliderFieldProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const RangeSliderField: React.FC<RangeSliderFieldProps> = ({
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(value);

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const handleSliderChange = (val: number[]) => {
    const newValue = val[0];
    setSliderValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{sliderValue}</span>
      </div>

      <Slider
        value={[sliderValue]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="w-full"
      />

      <div className="text-muted-foreground flex justify-between px-1 text-xs">
        <span className="text-muted-foreground">{min}</span>
        <span className="text-muted-foreground">{max}</span>
      </div>
    </div>
  );
};

export default RangeSliderField;
