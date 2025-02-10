type ClickableCircleProps = {
  onClick: () => void;
};

/**
 * The main clickable circle that generates points when clicked
 */
export function ClickableCircle({ onClick }: ClickableCircleProps) {
  return (
    <button
      onClick={onClick}
      className="w-24 h-24 md:w-48 md:h-48 rounded-full bg-blue-500 hover:bg-blue-400 
                 flex items-center justify-center text-white text-2xl
                 transform transition-transform duration-100 active:scale-95
                 focus:outline-none shadow-lg hover:shadow-xl
                 animate-pulse hover:animate-none"
    />
  );
} 