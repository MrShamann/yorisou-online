import { ReactNode } from "react";

type CardGridProps = {
  children: ReactNode;
  minWidth?: number;
};

export default function CardGrid({ children, minWidth = 240 }: CardGridProps) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}
