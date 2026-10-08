/**
 * SkeletonLoader - Animated placeholder for loading content
 * 
 * Usage:
 * {isLoading ? (
 *   <div className="grid gap-4">
 *     {[...Array(3)].map((_, i) => (
 *       <SkeletonLoader key={i} className="h-24" />
 *     ))}
 *   </div>
 * ) : (
 *   <DocumentList />
 * )}
 */

export default function SkeletonLoader({ className = 'h-12' }) {
  return (
    <div
      className={`${className} bg-gray-200 rounded-lg animate-pulse`}
      style={{
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'loading 1.5s infinite',
      }}
    >
      <style>{`
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
