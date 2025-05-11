"use client";

import { useState } from "react";
import { Fruit } from "@/types/fruit";

interface FruitCardProps {
  fruit: Fruit;
  onEdit: (fruit: Fruit) => void;
  onDelete: (id: number) => Promise<void>;
}

export default function FruitCard({ fruit, onEdit, onDelete }: FruitCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = async () => {
    if (!confirm("このフルーツを削除してもよろしいですか？")) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(fruit.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 ${
        isHovered ? "shadow-xl transform -translate-y-1" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{fruit.name}</h2>
        <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
          ID: {fruit.id}
        </span>
      </div>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>作成: {new Date(fruit.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>更新: {new Date(fruit.updatedAt).toLocaleString()}</span>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(fruit)}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            className="w-4 h-4 inline-block mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          編集
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
        >
          <svg
            className="w-4 h-4 inline-block mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          {isDeleting ? "削除中..." : "削除"}
        </button>
      </div>
    </div>
  );
}
