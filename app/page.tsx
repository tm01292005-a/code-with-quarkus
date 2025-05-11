"use client";

import { useEffect, useState } from "react";
import type {
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Fruit } from "@/types/fruit";
import FruitForm from "./components/FruitForm";
import FruitCard from "./components/FruitCard";
import Header from "./components/Header";
import Toast from "./components/Toast";
import SortSelect from "./components/SortSelect";
import DateRangeApiExample from "./components/DateRangeApiExample";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SampleButton } from "@code-with-quarkus/ui";

export default function Home() {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [filteredFruits, setFilteredFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFruit, setEditingFruit] = useState<Fruit | undefined>();
  const [sortBy, setSortBy] = useState("name_asc");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const queryClient = new QueryClient();

  const fetchFruits = async () => {
    try {
      const response = await fetch("http://localhost:8080/fruits");
      if (!response.ok) {
        throw new Error("フルーツの取得に失敗しました");
      }
      const data = await response.json();
      setFruits(data);
      setFilteredFruits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFruits();
  }, []);

  const handleSearch = (query: string) => {
    const filtered = fruits.filter((fruit) =>
      fruit.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFruits(filtered);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    const sorted = [...filteredFruits].sort((a, b) => {
      switch (value) {
        case "id_asc":
          return a.id - b.id;
        case "id_desc":
          return b.id - a.id;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "created_desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "created_asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "updated_desc":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "updated_asc":
          return (
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
        default:
          return 0;
      }
    });
    setFilteredFruits(sorted);
  };

  const handleAddFruit = async (name: string) => {
    try {
      const response = await fetch("http://localhost:8080/fruits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("フルーツの追加に失敗しました");
      }

      await fetchFruits();
      setIsFormOpen(false);
      setToast({
        message: "フルーツを追加しました",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "エラーが発生しました",
        type: "error",
      });
    }
  };

  const handleEditFruit = async (name: string) => {
    if (!editingFruit) return;

    try {
      const response = await fetch(
        `http://localhost:8080/fruits/${editingFruit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );

      if (!response.ok) {
        throw new Error("フルーツの更新に失敗しました");
      }

      await fetchFruits();
      setEditingFruit(undefined);
      setIsFormOpen(false);
      setToast({
        message: "フルーツを更新しました",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "エラーが発生しました",
        type: "error",
      });
    }
  };

  const handleDeleteFruit = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/fruits/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("フルーツの削除に失敗しました");
      }

      await fetchFruits();
      setToast({
        message: "フルーツを削除しました",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "エラーが発生しました",
        type: "error",
      });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredFruits);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFilteredFruits(items);
    setToast({
      message: "並び順を更新しました",
      type: "info",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={handleSearch} />
        <main className="container mx-auto px-4 py-8">
          {/* Date Range Picker & API Example */}
          <div className="mb-8">
            <DateRangeApiExample />
            <div className="mt-4">
              <SampleButton>共通UIサンプルボタン</SampleButton>
            </div>
          </div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">フルーツ一覧</h1>
              <p className="text-gray-600 mt-1">
                全{filteredFruits.length}件のフルーツ
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <SortSelect value={sortBy} onChange={handleSort} />
              <button
                onClick={() => {
                  setEditingFruit(undefined);
                  setIsFormOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                フルーツを追加
              </button>
            </div>
          </div>

          {isFormOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full transform transition-all duration-300 ease-in-out">
                <h2 className="text-xl font-semibold mb-4">
                  {editingFruit ? "フルーツを編集" : "フルーツを追加"}
                </h2>
                <FruitForm
                  fruit={editingFruit}
                  onSubmit={editingFruit ? handleEditFruit : handleAddFruit}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setEditingFruit(undefined);
                  }}
                />
              </div>
            </div>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fruits">
              {(provided: DroppableProvided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredFruits.map((fruit, index) => (
                    <Draggable
                      key={fruit.id}
                      draggableId={fruit.id.toString()}
                      index={index}
                    >
                      {(
                        provided: DraggableProvided,
                        snapshot: DraggableStateSnapshot
                      ) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transform transition-all duration-200 ${
                            snapshot.isDragging ? "scale-105 shadow-xl" : ""
                          }`}
                        >
                          <FruitCard
                            fruit={fruit}
                            onEdit={(fruit) => {
                              setEditingFruit(fruit);
                              setIsFormOpen(true);
                            }}
                            onDelete={handleDeleteFruit}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </main>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </QueryClientProvider>
  );
}
