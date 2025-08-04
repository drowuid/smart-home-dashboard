
interface NotificationBannerProps {
  message: string;
  onClose: () => void;
}

export default function NotificationBanner({ message, onClose }: NotificationBannerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/20 animate-slide-down">
      <div className="flex justify-between items-center">
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 text-white/80 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  );
}