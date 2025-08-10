import { IconType } from 'react-icons';
import { FaCss3Alt, FaHtml5, FaJava, FaPhp, FaPython } from 'react-icons/fa';
import {
  SiCplusplus,
  SiDart,
  SiElixir,
  SiGo,
  SiHaskell,
  SiJavascript,
  SiKotlin,
  SiLua,
  SiPerl,
  SiRuby,
  SiRust,
  SiScala,
  SiSwift,
  SiTypescript,
} from 'react-icons/si';
import { TbBrandCSharp } from 'react-icons/tb';

/**
 * Returns a react-icon component based on the provided programming language name.
 *
 * @param language - Name of the programming language (case-insensitive).
 * @returns A React component (IconType) or undefined if not found.
 */
export const getLanguageIcon = (language: string): IconType | undefined => {
  const normalized = language.trim().toLowerCase();

  const iconMap: Record<string, IconType> = {
    python: FaPython,
    typescript: SiTypescript,
    javascript: SiJavascript,
    rust: SiRust,
    go: SiGo,
    ruby: SiRuby,
    java: FaJava,
    php: FaPhp,
    html: FaHtml5,
    css: FaCss3Alt,
    cpp: SiCplusplus,
    cplusplus: SiCplusplus,
    csharp: TbBrandCSharp,
    kotlin: SiKotlin,
    swift: SiSwift,
    dart: SiDart,
    scala: SiScala,
    perl: SiPerl,
    haskell: SiHaskell,
    elixir: SiElixir,
    lua: SiLua,
  };

  return iconMap[normalized];
};
