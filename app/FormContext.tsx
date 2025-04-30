"use client";
import React, { createContext, useContext, useState } from "react";

/**
 * フォームの入力値を表す型
 */
export type FormValues = {
  episode: string;
  mode: string;
  title?: string;
  description?: string;
};

/**
 * フォームコンテキストの型
 */
type FormContextType = {
  values: FormValues;
  setValues: (v: FormValues) => void;
  reset: () => void;
};

const defaultValues: FormValues = {
  episode: "",
  mode: "fantasy",
};

const FormContext = createContext<FormContextType | undefined>(undefined);

/**
 * フォームコンテキストを取得するカスタムフック
 * @returns FormContextType
 * @throws Provider外で使用した場合のエラー
 */
export const useFormContext = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext must be used within FormProvider");
  return ctx;
};

/**
 * FormProvider コンポーネント
 * フォームの状態管理とリセット機能を提供する
 * @param children - 子コンポーネント
 */
export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [values, setValues] = useState<FormValues>(defaultValues);
  // --- 初期値設定と状態管理 ---
  // --- リセット関数定義 ---
  const reset = () => setValues(defaultValues);
  return (
    <FormContext.Provider value={{ values, setValues, reset }}>
      {children}
    </FormContext.Provider>
  );
};
