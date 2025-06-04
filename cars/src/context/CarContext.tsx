
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { Car } from '@/types';
import { db } from '@/lib/firebase'; // Импортируем инстанс Firestore
import { collection, addDoc, getDocs, onSnapshot, query, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';

interface CarContextType {
  cars: Car[];
  addCar: (newCar: Omit<Car, 'id'>) => Promise<string | null>; // Возвращает ID новой машины или null при ошибке
  getCarById: (id: string) => Promise<Car | undefined>; // Теперь асинхронный, так как может потребоваться загрузка
  isLoading: boolean;
  error: string | null;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider = ({ children }: { children: ReactNode }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const carsCollectionRef = collection(db, 'cars');
    // Сортируем по году (например, новые сначала) или по дате добавления, если есть такое поле
    const q = query(carsCollectionRef, orderBy('year', 'desc')); 

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const carsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Car));
        setCars(carsData);
        setIsLoading(false);
        setError(null);
      }, 
      (err) => {
        console.error("Error fetching cars from Firestore: ", err);
        setError("Не удалось загрузить список автомобилей.");
        setIsLoading(false);
      }
    );

    // Отписка при размонтировании компонента
    return () => unsubscribe();
  }, []);

  const addCar = useCallback(async (newCarData: Omit<Car, 'id'>): Promise<string | null> => {
    setIsLoading(true);
    try {
      // Можно добавить поле createdAt для сортировки по дате добавления
      // const carWithTimestamp = { ...newCarData, createdAt: Timestamp.now() };
      const docRef = await addDoc(collection(db, 'cars'), newCarData);
      // setCars(prevCars => [{ id: docRef.id, ...newCarData }, ...prevCars]); // Обновление через onSnapshot
      setIsLoading(false);
      return docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("Не удалось добавить автомобиль.");
      setIsLoading(false);
      return null;
    }
  }, []);

  const getCarById = useCallback(async (id: string): Promise<Car | undefined> => {
    // Сначала проверяем, есть ли машина в уже загруженном списке
    const carFromState = cars.find(car => car.id === id);
    if (carFromState) {
      return carFromState;
    }
    // Если нет, пробуем загрузить напрямую из Firestore (на случай, если cars еще не обновились)
    // Это также полезно, если пользователь переходит по прямой ссылке
    setIsLoading(true);
    try {
      const carDocRef = doc(db, 'cars', id);
      const carDocSnap = await getDoc(carDocRef);
      setIsLoading(false);
      if (carDocSnap.exists()) {
        return { id: carDocSnap.id, ...carDocSnap.data() } as Car;
      } else {
        console.log("No such document!");
        return undefined;
      }
    } catch (e) {
      console.error("Error fetching car by ID:", e);
      setError("Не удалось найти автомобиль.");
      setIsLoading(false);
      return undefined;
    }
  }, [cars]); // Зависимость от cars, чтобы использовать кэшированные данные

  const contextValue = useMemo(() => ({
    cars,
    addCar,
    getCarById,
    isLoading,
    error,
  }), [cars, addCar, getCarById, isLoading, error]);

  return (
    <CarContext.Provider value={contextValue}>
      {children}
    </CarContext.Provider>
  );
};

export const useCarContext = (): CarContextType => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
};
