import React from 'react';
import { icons } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

// FIX: The `IconProps` interface was not correctly inheriting properties like `color`,
// `size`, and `className` from `LucideProps`. Changing it to a `type` with an
// intersection (`&`) resolves this type inference issue, which fixes all related
// prop-type errors in other components.
type IconProps = LucideProps & {
  name: keyof typeof icons;
};

// FIX: The original component implementation explicitly destructured only a few props,
// causing type errors on that line and preventing other SVG attributes from being
// passed down. Using rest/spread syntax for props (`...props`) is more robust,
// solves the destructuring errors, and improves component flexibility.
const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    return null; // or a default icon
  }

  return <LucideIcon {...props} />;
};

export default Icon;
