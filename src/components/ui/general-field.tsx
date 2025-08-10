'use client';

import React, { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { KeywordInputSelect } from './keyword-input-select';
import { MultiSelect } from './multi-select';
import SingleSelect from './signle-select';

export interface Option {
  value: string;
  label: string;
}

interface GeneralFieldProps<T extends FieldValues> {
  label: string;
  type: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validation?: RegisterOptions<T, Path<T>>;
  options?: Option[];
  setValue?: UseFormSetValue<T>;
  getValues?: UseFormGetValues<T>;
  multiple_select?: boolean;
  defaultValue?: Option[];
  setFunction?: (value: string | string[]) => void;
  placeholder?: string;
  helperText?: string;
  helperTooltip?: string;
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
  icon?: React.ReactNode;
  valueType?: string;
  className?: string;
}

const GeneralField = <T extends FieldValues>({
  label,
  type,
  name,
  register,
  errors,
  validation,
  options = [],
  setValue,
  getValues,
  multiple_select = false,
  defaultValue = [],
  setFunction,
  placeholder,
  helperText,
  helperTooltip,
  icon,
  tooltipPosition = 'right',
  valueType = 'text',
  className,
}: GeneralFieldProps<T>) => {
  const hasError = !!errors[name];
  const [selectedOptions, setSelectedOptions] =
    useState<Option[]>(defaultValue);

  useEffect(() => {
    if (type !== 'select' || !setValue) return;
    if (JSON.stringify(defaultValue) === JSON.stringify(selectedOptions))
      return;
    if (multiple_select) {
      setSelectedOptions(defaultValue);
      setValue(name, defaultValue.map(opt => opt.value) as any);
    } else if (defaultValue.length > 0) {
      setSelectedOptions([defaultValue[0]]);
      setValue(name, defaultValue[0].value as any);
    }
  }, [JSON.stringify(defaultValue), type, setValue, name, multiple_select]);

  useEffect(() => {
    if (type === 'select' && register && setValue) {
      register(name, validation);
      const currentValue = getValues?.(name);
      const hasNoValue =
        currentValue === undefined ||
        currentValue === null ||
        (Array.isArray(currentValue) && currentValue.length === 0);

      if (hasNoValue && selectedOptions.length > 0) {
        const val = multiple_select
          ? selectedOptions.map(opt => opt.value)
          : selectedOptions[0]?.value;
        setValue(name, val as any);
      }
    }
  }, [selectedOptions]);

  const handleSelectChange = (val: string) => {
    setValue?.(name, val as any);
    setFunction?.(val);
    const found = options.find(opt => opt.value === val);
    if (found) setSelectedOptions([found]);
  };

  const handleMultiSelectChange = (vals: string[]) => {
    const newSelected = options.filter(opt => vals.includes(opt.value));
    setSelectedOptions(newSelected);
    setValue?.(name, vals as any);
    setFunction?.(vals);
  };

  return (
    <div className={cn('mb-6 w-full space-y-2', className)}>
      <div className="flex items-center gap-1">
        <Label
          htmlFor={name.toString()}
          className="text-muted-foreground text-sm font-medium"
        >
          {label}
        </Label>
        {helperTooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                </span>
              </TooltipTrigger>
              <TooltipContent side={tooltipPosition || 'right'}>
                <p className="max-w-[200px] text-xs">{helperTooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {helperText && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}

      {type === 'select' && !multiple_select ? (
        <SingleSelect
          id={`${name.toString()}-select`}
          value={selectedOptions[0]?.value}
          onChange={handleSelectChange}
          options={options}
          placeholder={placeholder}
          hasError={hasError}
          icon={icon}
        />
      ) : type === 'select' && multiple_select ? (
        <MultiSelect
          options={options}
          value={selectedOptions.map(opt => opt.value)}
          onChange={handleMultiSelectChange}
          placeholder={placeholder}
        />
      ) : type === 'keyword' ? (
        <KeywordInputSelect
          value={selectedOptions.map(opt => opt.value)}
          onChange={vals => {
            const newSelected = vals.map(v => ({ label: v, value: v }));
            setSelectedOptions(newSelected);
            setValue?.(name, vals as any);
            setFunction?.(vals);
          }}
          placeholder={placeholder}
          valueType={valueType}
          icon={icon}
        />
      ) : type === 'paragraph' ? (
        <div className="relative">
          <Textarea
            id={name.toString()}
            {...register(name, validation)}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
            className={`h-28 ${hasError ? 'border-red-500' : ''}`}
          />
        </div>
      ) : type === 'checkbox' ? (
        <div className="flex items-center space-x-2">
          <Checkbox id={name.toString()} {...register(name, validation)} />
          <Label
            htmlFor={name.toString()}
            className="text-muted-foreground text-sm"
          >
            Yes
          </Label>
        </div>
      ) : (
        <div className="relative">
          <Input
            id={name.toString()}
            type={type}
            {...register(name, validation)}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
            className={`${type === 'date' ? 'pl-4' : 'pl-10'} h-12`}
          />
          {icon && type !== 'date' && (
            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
              {icon}
            </span>
          )}
        </div>
      )}

      {hasError && (
        <motion.p
          id={`${name}-error`}
          role="alert"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2 text-xs text-red-500"
        >
          {errors[name]?.message?.toString()}
        </motion.p>
      )}
    </div>
  );
};

export default GeneralField;
