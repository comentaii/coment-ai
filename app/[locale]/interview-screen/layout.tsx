import { ReactNode } from 'react';

interface InterviewLayoutProps {
  children: ReactNode;
}

export default function InterviewLayout({ children }: InterviewLayoutProps) {
  // Bu layout, interview screen için ana layout'u bypass eder
  // Böylece tam ekran deneyim sağlanır
  return (
    <div className="w-full h-screen overflow-hidden">
      {children}
    </div>
  );
}
