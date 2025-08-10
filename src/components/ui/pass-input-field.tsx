'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';
import { Check, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import GeneralButton from './general-button';

interface PasswordInputFieldProps<T extends FieldValues> {
  name: Path<T>;
  confirmName?: Path<T>;
  withConfirmation?: boolean;
  register: UseFormRegister<T>;
  watch?: UseFormWatch<T>;
  validation?: RegisterOptions<T, Path<T>>;
  errors: FieldErrors<T>;
  placeholder?: string;
  helperText?: string;
}

const PasswordInputField = <T extends FieldValues>({
  name,
  confirmName,
  withConfirmation = false,
  register,
  watch,
  validation,
  errors,
  placeholder = '********',
  helperText,
}: PasswordInputFieldProps<T>) => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchError, setMatchError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use React Hook Form's watch to get the password value
  const password = (watch ? watch(name) : '') as string;

  const criteria = [
    {
      label: 'At least 8 characters',
      isValid: password && password.length >= 8,
    },
    {
      label: 'One uppercase letter',
      isValid: password && /[A-Z]/.test(password),
    },
    {
      label: 'One lowercase letter',
      isValid: password && /[a-z]/.test(password),
    },
    { label: 'One number', isValid: password && /\d/.test(password) },
    {
      label: 'One special character',
      isValid: password && /[^A-Za-z0-9]/.test(password),
    },
  ];

  const passedCriteriaCount = criteria.filter(c => c.isValid).length;

  const getStrengthLabel = () => {
    if (passedCriteriaCount <= 2)
      return { label: 'Weak', color: 'text-red-500' };
    if (passedCriteriaCount <= 4)
      return { label: 'Medium', color: 'text-yellow-500' };
    return { label: 'Strong', color: 'text-green-600' };
  };

  // Detect autofill and update React Hook Form
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleAutofill = () => {
      // Trigger a change event to notify React Hook Form
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    };

    // Check for autofill on mount and after a short delay
    const checkAutofill = () => {
      if (input.value && !password) {
        handleAutofill();
      }
    };

    // Check immediately and after a delay to catch autofill
    checkAutofill();
    const timeoutId = setTimeout(checkAutofill, 100);
    const timeoutId2 = setTimeout(checkAutofill, 500); // Additional check for slower autofill

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [password]);

  useEffect(() => {
    if (withConfirmation && confirmPassword && password !== confirmPassword) {
      setMatchError('Passwords do not match');
    } else {
      setMatchError(null);
    }
  }, [password, confirmPassword, withConfirmation]);

  return (
    <div className="mb-6 w-full space-y-4">
      {/* Password Field */}
      <div className="relative">
        <div className="pb-2">
          <Label
            htmlFor={name.toString()}
            className="text-muted-foreground block text-sm font-medium"
          >
            Password
          </Label>
          {helperText && (
            <p className="text-muted-foreground mt-1 text-xs">{helperText}</p>
          )}
        </div>

        <div className="relative">
          <Input
            id={name.toString()}
            type={visible ? 'text' : 'password'}
            {...register(name, validation)}
            placeholder={placeholder}
            className="h-12 pr-10 pl-10"
            ref={e => {
              // Handle both React Hook Form ref and our custom ref
              const { ref } = register(name, validation);
              if (typeof ref === 'function') {
                ref(e);
              }
              inputRef.current = e;
            }}
          />
          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
            <Lock className="h-4 w-4" />
          </span>
          <button
            type="button"
            onClick={() => setVisible(prev => !prev)}
            className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {!withConfirmation && (
          <GeneralButton
            text="Forgot Password?"
            variant="link"
            type="button"
            className="text-primary mt-1 w-full cursor-pointer text-xs hover:underline"
            icon={<KeyRound className="h-4 w-4" />}
            onClick={() => router.push('/forgot-password')}
          />
        )}

        {errors[name] && (
          <motion.p
            className="mt-1 text-sm text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {errors[name]?.message?.toString()}
          </motion.p>
        )}

        {/* Password Strength */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">Password strength:</p>
          <p className={`text-sm font-medium ${getStrengthLabel().color}`}>
            {getStrengthLabel().label}
          </p>
        </div>

        {/* Criteria Checklist */}
        <div className="mt-2 space-y-1 text-sm">
          {criteria.map(v => (
            <div
              key={v.label}
              className={`flex items-center gap-2 ${v.isValid ? 'text-green-600' : 'text-muted-foreground'}`}
            >
              {v.isValid && <Check size={14} />}
              <span>{v.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirm Password Field (Same UI) */}
      {withConfirmation && confirmName && (
        <div className="relative">
          <div className="flex items-center pb-2">
            <Label
              htmlFor={confirmName.toString()}
              className="text-muted-foreground text-sm font-medium"
            >
              Confirm Password
            </Label>
          </div>
          <div className="relative">
            <Input
              id={confirmName.toString()}
              type={visible ? 'text' : 'password'}
              {...register(confirmName, {
                required: validation
                  ? 'Please confirm your password'
                  : undefined,
                validate: (val: string) =>
                  val === password || 'Passwords do not match',
              })}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="h-12 pr-10 pl-10"
            />
            <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
              <Lock className="h-4 w-4" />
            </span>
            <button
              type="button"
              onClick={() => setVisible(prev => !prev)}
              className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {(matchError || errors[confirmName]) && (
            <motion.p
              className="mt-1 text-sm text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {matchError || errors[confirmName]?.message?.toString()}
            </motion.p>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordInputField;
