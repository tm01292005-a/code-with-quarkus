"use client";

import { useState } from "react";
import { Fruit } from "@/types/fruit";

interface FruitFormProps {
  fruit?: Fruit;
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
}

export default function FruitForm({
  fruit,
  onSubmit,
  onCancel,
}: FruitFormProps) {
  const [name, setName] = useState(fruit?.name || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("フルーツ名を入力してください");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(name);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          フルーツ名
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="フルーツ名を入力"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "送信中..." : fruit ? "更新" : "追加"}
        </button>
      </div>
    </form>
  );
}
