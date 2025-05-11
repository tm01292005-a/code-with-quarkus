import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useQuery } from "@tanstack/react-query";

// 環境変数からBaseURLを取得
const BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_BASE_URL;

// 型定義を追加
const fetchData = async ({
  queryKey,
}: {
  queryKey: [string, { from: Date | undefined; to: Date | undefined }];
}) => {
  const [_key, { from, to }] = queryKey;
  if (!from || !to) return null;

  const fromStr = from.toISOString().split("T")[0];
  const toStr = to.toISOString().split("T")[0];

  // BaseURLが未設定の場合はエラー
  if (!BASE_URL) throw new Error("API GatewayのBaseURLが設定されていません");

  const url = `${BASE_URL}?from=${fromStr}&to=${toStr}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export default function DateRangeApiExample() {
  const [range, setRange] = useState({ from: undefined, to: undefined });

  const { data, error, isFetching } = useQuery({
    queryKey: ["apiData", { from: range.from, to: range.to }],
    queryFn: fetchData,
    enabled: !!range.from && !!range.to,
  });

  return (
    <div>
      <DayPicker mode="range" selected={range} onSelect={setRange} />
      {range.from && range.to && (
        <p>
          選択範囲: {range.from.toLocaleDateString()} 〜{" "}
          {range.to.toLocaleDateString()}
        </p>
      )}
      {isFetching && <div>読み込み中...</div>}
      {error && <div>エラー: {error.message}</div>}
      {data && (
        <div>
          <h2>API Gatewayからのデータ</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
