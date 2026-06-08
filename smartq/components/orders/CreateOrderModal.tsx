import React from "react";
export default function CreateOrderModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return <div>CreateOrderModal</div>;
}
